const {
  computeCns,
  computePeriods,
  calculateWorkingMinutes,
  hoursBetween,
  calculateSuspendedMinutes
} = require('../../../backend/lib/cns/cns');
const expect = require('chai').expect;
const moment = require('moment-timezone');

const DEFAULT_TIMEZONE = {
  name: '(GMT+01:00) Central European Time - Paris',
  value: 'Europe/Paris'
};

moment.tz.setDefault(DEFAULT_TIMEZONE.value);

const currentDate = moment('2019-09-30T18:00:00.697+02:00');

function getCurrentDate() {
  return currentDate;
}

moment.now = function() {
  return getCurrentDate();
};

const ticket = {
  createdDuringBusinessHours: true,
  software: {
    software: '5d9dab9cdeed5a496dc35e35',
    critical: 'critical'
  },
  timestamps: {
    updatedAt: '2019-09-27T11:28:14.223+02:00',
    createdAt: '2019-09-26T13:44:44.697+02:00'
  },
  status: 'new',
  contract: 'contractId',
  events: [],
  type: 'Anomaly'
};

const contract = {
  timezone: 'Europe/Paris',
  businessHours: {
    start: 9,
    end: 18
  },
  features: {
    nonBusinessHours: false
  },
  Engagements: {
    critical: {
      engagements: [
        {
          request: 'Anomaly',
          supported: {
            businessHours: 'PT1H',
            nonBusinessHours: 'PT2H'
          },
          bypassed: {
            businessHours: 'P1D',
            nonBusinessHours: 'P2D'
          },
          resolved: {
            businessHours: 'P2D',
            nonBusinessHours: 'P4D'
          }
        }
      ]
    },
    sensible: {
      engagements: [
        {
          request: 'Anomaly',
          supported: {
            businessHours: 'PT1H',
            nonBusinessHours: 'PT2H'
          },
          bypassed: {
            businessHours: 'P1D',
            nonBusinessHours: 'P2D'
          },
          resolved: {
            businessHours: 'P2D',
            nonBusinessHours: 'P4D'
          }
        }
      ]
    },
    standard: {
      engagements: [
        {
          request: 'Anomaly',
          supported: {
            businessHours: 'PT1H',
            nonBusinessHours: 'PT2H'
          },
          bypassed: {
            businessHours: 'P1D',
            nonBusinessHours: 'P2D'
          },
          resolved: {
            businessHours: 'P2D',
            nonBusinessHours: 'P4D'
          }
        }
      ]
    }
  }
};

let ticketCopy;

describe('CNS calculation', () => {
  beforeEach(() => {
    ticketCopy = ticket;
    ticketCopy.events = [];
  });

  describe('The computeCns function', () => {
    it('should be a valid structure ', () => {
      const { supported, bypassed, resolved } = computeCns(ticketCopy, contract);

      expect(supported).to.be.an('object');
      expect(bypassed).to.be.an('object');
      expect(resolved).to.be.an('object');
    });

    it('should compute cns correctly when issue is in supported state', () => {
      const cns = computeCns(ticketCopy, contract);

      expect(cns.supported.elapsedMinutes).to.equal(1335);
      expect(cns.supported.suspendedMinutes).to.equal(0);
      expect(cns.supported.engagementDuration).to.be.undefined;
      expect(cns.supported.workingHoursInterval).to.be.undefined;
    });

    it('should compute cns correctly when issue is in bypassed state', () => {
      const createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(3, 'hours');

      ticketCopy.events.push({
        status: 'supported',
        timestamps: {
          createdAt
        },
        target: {
          type: 'expert'
        }
      });

      const cns = computeCns(ticketCopy, contract);

      expect(cns.supported.elapsedMinutes).to.equal(180);
      expect(cns.bypassed.elapsedMinutes).to.equal(1155);
      expect(cns.resolved.elapsedMinutes).to.equal(cns.bypassed.elapsedMinutes);
    });

    it('should not increment counter when ticket is assigned to a client', () => {
      let createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(2, 'hours');

      ticketCopy.events.push({
        status: 'supported',
        timestamps: {
          createdAt
        },
        target: {
          type: 'beneficiary'
        }
      });

      // Assign ticket to an expert
      createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(3, 'hours');

      ticketCopy.events.push({
        status: 'supported',
        timestamps: {
          createdAt
        },
        target: {
          type: 'expert'
        }
      });

      createdAt = moment(ticketCopy.timestamps.createdAt)
        .clone()
        .add(1, 'hours');
      ticketCopy.events.push({
        status: 'bypassed',
        timestamps: {
          createdAt
        },
        target: {
          type: 'expert'
        }
      });

      const cns = computeCns(ticketCopy, contract);

      expect(cns.bypassed.elapsedMinutes).to.equal(1155);
    });
  });

  describe('The hoursBetween function', () => {
    it('should calculate the hours between two dates correctly', () => {
      const date1 = '2019-09-26T13:44:44.697+02:00';
      const date2 = '2019-09-26T17:44:44.697+02:00';

      expect(hoursBetween(date1, date2)).to.equal(4);
    });
  });

  describe('The calculateWorkingMinutes function', () => {
    describe('The start date and end date are the same day', () => {
      it('should calculate correctly when start and end are in working hours', () => {
        const start = '2019-09-26T15:44:44.697+02:00';
        const end = '2019-09-26T17:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(120);
      });

      it('should calculate correctly when end is after working hours', () => {
        const start = '2019-09-26T15:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(135);
      });

      it('should calculate correctly when start is before working hours and end is after working hours', () => {
        const start = '2019-09-26T07:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(540);
      });

      it('should calculate correctly when start is after working hours and end is after working hours', () => {
        const start = '2019-09-26T18:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(0);
      });
    });

    describe('The start date is the day before end date', () => {
      it('should calculate correctly when start and end are in working hours', () => {
        const start = '2019-09-25T15:44:44.697+02:00';
        const end = '2019-09-26T17:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(540 + 120);
      });

      it('should calculate correctly when end is after working hours', () => {
        const start = '2019-09-25T15:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(540 + 135);
      });

      it('should calculate correctly when start is before working hours and end is after working hours', () => {
        const start = '2019-09-25T07:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(540 + 540);
      });

      it('should calculate correctly when start is after working hours and end is after working hours', () => {
        const start = '2019-09-25T18:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(540);
      });
    });

    describe('The start date is two weeks before end date', () => {
      it('should calculate correctly when start and end are in working hours', () => {
        const start = '2019-09-12T15:44:44.697+02:00';
        const end = '2019-09-26T17:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(10 * 540 + 120);
      });

      it('should calculate correctly when end is after working hours', () => {
        const start = '2019-09-12T15:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(10 * 540 + 135);
      });

      it('should calculate correctly when start is before working hours and end is after working hours', () => {
        const start = '2019-09-12T07:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(10 * 540 + 540);
      });

      it('should calculate correctly when start is after working hours and end is after working hours', () => {
        const start = '2019-09-12T18:44:44.697+02:00';
        const end = '2019-09-26T19:44:44.697+02:00';

        expect(calculateWorkingMinutes(start, end, 9, 18)).to.equal(10 * 540);
      });
    });
  });

  describe('The computePeriods function', () => {
    const ticketCreationDate = '2019-09-26T13:00:00.000+02:00';

    describe('with empty events', () => {
      it('should compute new period only', () => {
        const periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.undefined;
        expect(periods.bypassed).to.be.undefined;
      });

      it('should set new period start to ticket creation date', () => {
        const periods = computePeriods(undefined, ticketCreationDate);

        expect(periods.new.start).to.deep.equal(moment(ticketCreationDate));
      });

      it('should set new period end to current date', () => {
        const periods = computePeriods(undefined, ticketCreationDate);

        // `format('X')` Convert moment object to timestamp
        expect(periods.new.end.format('X')).to.equal(currentDate.format('X'));
      });
    });

    describe('with supported status change event', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new and supported periods only', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.undefined;
      });

      it('should set new period start to ticket creation date', () => {
        expect(periods.new.start).to.deep.equal(moment(ticketCreationDate));
      });

      it('should set new period end to supported status change date', () => {
        expect(periods.new.end).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period start to supported status change date', () => {
        expect(periods.supported.start).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period end to current date', () => {
        expect(periods.supported.end.format('X')).to.equal(currentDate.format('X'));
      });
    });

    describe('with supported and bypassed status changes events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new and supported periods only', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should set new period start to ticket creation date', () => {
        expect(periods.new.start).to.deep.equal(moment(ticketCreationDate));
      });

      it('should set new period end to supported status change date', () => {
        expect(periods.new.end).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period start to supported status change date', () => {
        expect(periods.supported.start).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period end to bypassed status change date', () => {
        expect(periods.supported.end).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period start to bypassed status change date', () => {
        expect(periods.bypassed.start).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period end to current date', () => {
        expect(periods.bypassed.end.format('X')).to.equal(currentDate.format('X'));
      });
    });

    describe('with supported, bypassed and resolved status changes events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';
      const resolvedStatusChange = '2019-09-26T18:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        },
        {
          status: 'resolved',
          timestamps: {
            createdAt: resolvedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new and supported periods only', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should set new period start to ticket creation date', () => {
        expect(periods.new.start).to.deep.equal(moment(ticketCreationDate));
      });

      it('should set new period end to supported status change date', () => {
        expect(periods.new.end).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period start to supported status change date', () => {
        expect(periods.supported.start).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period end to bypassed status change date', () => {
        expect(periods.supported.end).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period start to bypassed status change date', () => {
        expect(periods.bypassed.start).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period end resolved status change date', () => {
        expect(periods.bypassed.end).to.deep.equal(moment(resolvedStatusChange));
      });
    });

    describe('with supported and bypassed status changes and expert assignment events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const expert1AssignDate = '2019-09-26T13:00:00.000+02:00';
      const expert2AssignDate = '2019-09-26T14:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          },
          target: {
            type: 'expert'
          }
        },
        {
          timestamps: {
            createdAt: expert1AssignDate
          },
          target: {
            type: 'expert'
          }
        },
        {
          timestamps: {
            createdAt: expert2AssignDate
          },
          target: {
            type: 'expert'
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          },
          target: {
            type: 'expert'
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new and supported and bypassed periods', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should not add suspensions', () => {
        expect(periods.new.suspensions).to.be.defined;
        expect(periods.new.suspensions.length).to.equal(0);

        expect(periods.supported.suspensions).to.be.defined;
        expect(periods.supported.suspensions.length).to.equal(0);

        expect(periods.bypassed.suspensions).to.be.defined;
        expect(periods.bypassed.suspensions.length).to.equal(0);
      });
    });

    describe('with status changes and beneficiary and expert assignments while supported events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const beneficiaryAssignDate = '2019-09-26T13:00:00.000+02:00';
      const expertAssignDate = '2019-09-26T14:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiaryAssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: 'expert'
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          },
          target: {
            type: 'expert'
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new, supported and periods ', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should add suspensions for supported only', () => {
        expect(periods.new.suspensions).to.be.defined;
        expect(periods.new.suspensions.length).to.equal(0);

        expect(periods.supported.suspensions).to.be.defined;
        expect(periods.supported.suspensions.length).to.equal(1);

        expect(periods.bypassed.suspensions).to.be.defined;
        expect(periods.bypassed.suspensions.length).to.equal(0);
      });

      it('should add suspensions with beneficiary assignment date as start date', () => {
        expect(periods.supported.suspensions[0].start).to.deep.equal(moment(beneficiaryAssignDate));
      });

      it('should add suspensions with expert assignment date as end date', () => {
        expect(periods.supported.suspensions[0].end).to.deep.equal(moment(expertAssignDate));
      });
    });

    describe('with status changes and not ending beneficiary assignment while supported events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const beneficiaryAssignDate = '2019-09-26T13:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiaryAssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);

      it('should compute new, supported and periods ', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should add suspensions for supported and bypassed', () => {
        expect(periods.new.suspensions).to.be.defined;
        expect(periods.new.suspensions.length).to.equal(0);

        expect(periods.supported.suspensions).to.be.defined;
        expect(periods.supported.suspensions.length).to.equal(1);

        expect(periods.bypassed.suspensions).to.be.defined;
        expect(periods.bypassed.suspensions.length).to.equal(1);
      });

      it('should add supported suspensions with beneficiary assignment date as start date', () => {
        expect(periods.supported.suspensions[0].start).to.deep.equal(moment(beneficiaryAssignDate));
      });

      it('should add supported suspensions with bypassed statuschange date as end date', () => {
        expect(periods.supported.suspensions[0].end).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should add bypassed suspensions with status change date as start date', () => {
        expect(periods.bypassed.suspensions[0].start).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should add bypassed suspensions with current date as end date', () => {
        expect(periods.bypassed.suspensions[0].end.format('X')).to.deep.equal(moment(currentDate).format('X'));
      });
    });

    describe('with status changes and several beneficiary assignments while supported events', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const beneficiary1AssignDate = '2019-09-26T13:00:00.000+02:00';
      const expertAssignDate = '2019-09-26T14:00:00.000+02:00';
      const beneficiary2AssignDate = '2019-09-26T15:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiary1AssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: 'expert'
          }
        },
        {
          timestamps: {
            createdAt: beneficiary2AssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);
      const hnoSuspendedMinutes = calculateSuspendedMinutes(periods.supported.suspensions, 0, 24, true);

      it('should compute new, supported and periods ', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should add suspensions for supported and bypassed', () => {
        expect(periods.new.suspensions).to.be.defined;
        expect(periods.new.suspensions.length).to.equal(0);

        expect(periods.supported.suspensions).to.be.defined;
        expect(periods.supported.suspensions.length).to.equal(2);

        expect(periods.bypassed.suspensions).to.be.defined;
        expect(periods.bypassed.suspensions.length).to.equal(1);
      });

      it('should add supported suspensions with beneficiary assignment date as start date', () => {
        expect(periods.supported.suspensions[0].start).to.deep.equal(moment(beneficiary1AssignDate));
      });

      it('should add supported suspensions with beneficiary assignment date as start date', () => {
        expect(periods.supported.suspensions[0].end).to.deep.equal(moment(expertAssignDate));
      });

      it('should add supported suspensions with beneficiary assignment date as start date', () => {
        expect(periods.supported.suspensions[1].start).to.deep.equal(moment(beneficiary2AssignDate));
      });

      it('should add supported suspensions with bypassed statuschange date as end date', () => {
        expect(periods.supported.suspensions[1].end).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should add bypassed suspensions with status change date as start date', () => {
        expect(periods.bypassed.suspensions[0].start).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should add bypassed suspensions with current date as end date', () => {
        expect(periods.bypassed.suspensions[0].end.format('X')).to.deep.equal(moment(currentDate).format('X'));
      });

      it('should calculate the suspended time correctly', () => {
        expect(hnoSuspendedMinutes).to.equal(120);
      });
    });

    describe('with status changes and several beneficiary assignments while supported events in NBH', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const beneficiary1AssignDate = '2019-09-26T13:00:00.000+02:00';
      const expertAssignDate = '2019-09-27T14:00:00.000+02:00';
      const beneficiary2AssignDate = '2019-09-27T15:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-28T16:00:00.000+02:00';

      const events = [
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        },
        {
          timestamps: {
            createdAt: beneficiary1AssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          timestamps: {
            createdAt: expertAssignDate
          },
          target: {
            type: 'expert'
          }
        },
        {
          timestamps: {
            createdAt: beneficiary2AssignDate
          },
          target: {
            type: 'beneficiary'
          }
        },
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        }
      ];

      const periods = computePeriods(events, ticketCreationDate);
      const hnoSuspendedMinutes = calculateSuspendedMinutes(periods.supported.suspensions, 0, 24, true);

      it('should calculate the suspended time correctly in non business hour', () => {
        // It should be 2 days 2 hours = 50 hours = 3000 minutes.
        expect(hnoSuspendedMinutes).to.equal(3000);
      });
    });

    describe('with unordered event list with status changes', () => {
      const supportedStatusChange = '2019-09-26T12:00:00.000+02:00';
      const bypassedStatusChange = '2019-09-26T16:00:00.000+02:00';

      const unorderedEvents = [
        {
          status: 'bypassed',
          timestamps: {
            createdAt: bypassedStatusChange
          }
        },
        {
          status: 'supported',
          timestamps: {
            createdAt: supportedStatusChange
          }
        }
      ];

      const periods = computePeriods(unorderedEvents, ticketCreationDate);

      it('should compute new and supported periods only', () => {
        expect(periods.new).to.be.defined;
        expect(periods.supported).to.be.defined;
        expect(periods.bypassed).to.be.defined;
      });

      it('should set new period start to ticket creation date', () => {
        expect(periods.new.start).to.deep.equal(moment(ticketCreationDate));
      });

      it('should set new period end to supported status change date', () => {
        expect(periods.new.end).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period start to supported status change date', () => {
        expect(periods.supported.start).to.deep.equal(moment(supportedStatusChange));
      });

      it('should set supported period end to bypassed status change date', () => {
        expect(periods.supported.end).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period start to bypassed status change date', () => {
        expect(periods.bypassed.start).to.deep.equal(moment(bypassedStatusChange));
      });

      it('should set bypassed period end to current date', () => {
        expect(periods.bypassed.end.format('X')).to.equal(currentDate.format('X'));
      });
    });
  });
});
