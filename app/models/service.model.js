module.exports = mongoose => {
    const serviceSchema = mongoose.Schema(
        {
            title: String,
        },
        {timestamps: true}
    );

    serviceSchema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("services", serviceSchema);
};
