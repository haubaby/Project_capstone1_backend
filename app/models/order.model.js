module.exports = mongoose => {
    const orderSchema = mongoose.Schema(
        {
            event: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "events"
            },
            renters: [
                {
                    renter: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "renters"
                    },
                    quantity: Number
                }
            ],
            address: String,
            phone: String,
            user: String,
        },
        { timestamps: true }
    );

    orderSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("orders", orderSchema);
};
