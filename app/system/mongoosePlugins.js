function softDelete() {
    const softDeleteConditions = () => {
        this._conditions = Object.assign({ deleted: { $in: [false, null] } }, this._conditions); // eslint-disable-line
    };

    return (schema) => {
        schema.add({ deleted: { type: Boolean } });
        schema.add({ deleted_at: { type: Date } });
        schema.pre('find', softDeleteConditions);
        schema.pre('findOne', softDeleteConditions);
        schema.pre('update', softDeleteConditions);
        schema.pre('findOneAndRemove', softDeleteConditions);
        schema.pre('findOneAndUpdate', softDeleteConditions);
        schema.statics.softDelete = (query) => { // eslint-disable-line
            this.update(query, { deleted: true, deleted_at: new Date() });
        };
    };
}

module.exports = { softDelete };
