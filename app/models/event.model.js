module.exports = mongoose => {
    const eventSchema = mongoose.Schema(
        {
            title: String,
            content: String,
            banner: String,
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'services'
            },
        },
        { timestamps: true }
    );

    eventSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("events", eventSchema);
};
