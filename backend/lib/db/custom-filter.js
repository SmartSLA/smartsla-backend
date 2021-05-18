'use strict';

module.exports = dependencies => {
    const mongoose = dependencies('db').mongo.mongoose;

    const ValueSchema = new mongoose.Schema({
        name: { type: String },
        id: { type: String }
    }, { _id: false });

    const ItemSchema = new mongoose.Schema({
        category: { type: String, required: true },
        value: ValueSchema
    }, { _id: false });

    const CustomFilterSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        objectType: { type: String, enum: ['REQUEST', 'CONTRIBUTION'] },
        items: [ItemSchema],
        timestamps: {
            creation: { type: Date, default: Date.now }
        },
        schemaVersion: { type: Number, default: 1 }
    });

    const FilterModel = mongoose.model('CustomFilter', CustomFilterSchema);

    return FilterModel;
};
