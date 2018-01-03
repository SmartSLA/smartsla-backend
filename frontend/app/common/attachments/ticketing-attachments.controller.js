(function(angular) {
  angular.module('linagora.esn.ticketing')
    .controller('TicketingAttachmentsController', TicketingAttachmentsController);

  function TicketingAttachmentsController(
    $filter,
    _,
    fileUploadService,
    notificationFactory,
    esnI18nService
  ) {
    var self = this;
    var DEFAULT_MAX_SIZE_UPLOAD = 5242880; // 5MB

    self.$onInit = $onInit;

    function $onInit() {
      self.onAttachmentsSelect = onAttachmentsSelect;
      self.removeAttachment = removeAttachment;
    }

    function onAttachmentsSelect($attachments) {
      if (!$attachments || $attachments.length === 0) {
        return;
      }

      self.attachments = self.attachments || [];
      var humanReadableMaxSizeUpload = $filter('bytes')(DEFAULT_MAX_SIZE_UPLOAD);

      $attachments.forEach(function(file) {
        if (file.size > DEFAULT_MAX_SIZE_UPLOAD) {
          return notificationFactory.weakError('',
            esnI18nService.translate('File %s ignored as its size exceeds the %s limit', file.name, humanReadableMaxSizeUpload).toString()
          );
        }

        self.attachments.push(file);
        _upload(file);
      });
    }

    function removeAttachment(attachment) {
      _.pull(self.attachments, attachment);
      _cancelAttachment(attachment);
    }

    function _cancelAttachment(attachment) {
      attachment.upload && attachment.upload.cancel();
      _updateAttachmentStatus();
    }

    function _upload(attachment) {
      var uploader = fileUploadService.get();
      var uploadTask = uploader.addFile(attachment); // Do not start the upload immediately

      attachment.status = 'uploading';
      attachment.upload = {
        progress: 0,
        cancel: uploadTask.cancel
      };
      attachment.upload.promise = uploadTask.defer.promise.then(function(task) {
        attachment.status = 'uploaded';
        attachment.blobId = task.response.blobId;
        attachment._id = task.response.data._id;
      }, function() {
        attachment.status = 'error';
      }, function(uploadTask) {
        attachment.upload.progress = uploadTask.progress;
      }).finally(_updateAttachmentStatus);

      _updateAttachmentStatus();
      uploader.start(); // Start transferring data
    }

    function _updateAttachmentStatus() {
      self.attachmentStatus = {
        number: self.attachments.length,
        uploading: _.some(self.attachments, { status: 'uploading' }),
        error: _.some(self.attachments, { status: 'error' })
      };
    }
  }
})(angular);
