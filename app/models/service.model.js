module.exports = mongoose => {
    const serviceSchema = mongoose.Schema(
        {
            title: String,
            settings: [
                {
                    name: String,
                    renters: [
                        {
                            renter: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "renters"
                            },
                            price: Number,
                            quantity: Number
                        }
                    ],
                }
            ]
        },
        { timestamps: true }
    );

    serviceSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("services", serviceSchema);
};
