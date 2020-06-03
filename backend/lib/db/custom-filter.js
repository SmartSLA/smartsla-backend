'use strict';

module.exports = dependencies => {
    const mongoose = dependencies('db').mongo.mongoose;

    const ItemSchema = new mongoose.Schema({
        category: { type: String, required: true },
        value: { type: String }
    }, { _id: false });

    const CustomFilterSchema = new mongoose.Schema({
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        items: [ItemSchema],
        timestamps: {
            creation: { type: Date, default: Date.now }
        },
        schemaVersion: { type: Number, default: 1 }
    });

    const FilterModel = mongoose.model('CustomFilter', CustomFilterSchema);

    return FilterModel;
};
