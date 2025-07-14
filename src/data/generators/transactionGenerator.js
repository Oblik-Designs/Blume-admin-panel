import { faker } from "@faker-js/faker";
const generateObjectId = () => {
    return faker.database.mongodbObjectId();
};
const transactionTypes = [
    "bp_purchase",
    "plan_payment",
    "plan_earning",
    "gift_sent",
    "gift_received",
    "escrow_hold",
    "escrow_release",
    "admin_adjustment",
    "refund",
    "withdrawal",
];
const transactionStatuses = ["pending", "completed", "completed", "failed"];
export const generateTransaction = (userId = null, index = 0) => {
    const type = faker.helpers.arrayElement(transactionTypes);
    const status = faker.helpers.arrayElement(transactionStatuses);
    const createdAt = faker.date.past({ years: 1 });
    const getAmountByType = (type) => {
        switch (type) {
            case "bp_purchase":
                return faker.number.int({ min: 1000, max: 50000 });
            case "plan_payment":
            case "plan_earning":
                return faker.number.int({ min: 200, max: 5000 });
            case "gift_sent":
            case "gift_received":
                return faker.helpers.arrayElement([
                    500, 800, 1000, 1200, 1500, 2000,
                ]);
            case "escrow_hold":
            case "escrow_release":
                return faker.number.int({ min: 500, max: 3000 });
            case "admin_adjustment":
                return faker.number.int({ min: -2000, max: 5000 });
            case "refund":
                return faker.number.int({ min: 200, max: 3000 });
            case "withdrawal":
                return faker.number.int({ min: 1000, max: 10000 });
            default:
                return faker.number.int({ min: 100, max: 2000 });
        }
    };
    const amount = getAmountByType(type);
    const serviceFee = type === "bp_purchase" ? Math.round(amount * 0.1) : 0;
    const getDescription = (type, amount) => {
        switch (type) {
            case "bp_purchase":
                return `Purchased ${amount} BeensPoints`;
            case "plan_payment":
                return `Payment for plan participation`;
            case "plan_earning":
                return `Earned from hosting plan`;
            case "gift_sent":
                return `Gift sent to user`;
            case "gift_received":
                return `Gift received from user`;
            case "escrow_hold":
                return `Payment held in escrow`;
            case "escrow_release":
                return `Escrow payment released`;
            case "admin_adjustment":
                return amount > 0
                    ? "Admin credit adjustment"
                    : "Admin debit adjustment";
            case "refund":
                return `Refund for cancelled plan`;
            case "withdrawal":
                return `Withdrawal to bank account`;
            default:
                return "Transaction";
        }
    };
    return {
        id: generateObjectId(),
        user_id: userId || generateObjectId(),
        type: type,
        amount: amount,
        service_fee: serviceFee,
        net_amount: amount - serviceFee,
        description: getDescription(type, amount),
        status: status,
        reference_id: [
            "plan_payment",
            "plan_earning",
            "escrow_hold",
            "escrow_release",
        ].includes(type)
            ? generateObjectId()
            : null,
        gateway_transaction_id:
            type === "bp_purchase" ? faker.string.alphanumeric(20) : null,
        created_at: createdAt,
        updated_at:
            status === "completed"
                ? faker.date.between({ from: createdAt, to: new Date() })
                : createdAt,
        completed_at:
            status === "completed"
                ? faker.date.between({ from: createdAt, to: new Date() })
                : null,
        failed_reason:
            status === "failed"
                ? faker.helpers.arrayElement([
                      "Insufficient funds",
                      "Payment gateway error",
                      "Invalid payment method",
                      "Transaction declined",
                  ])
                : null,
        metadata: {
            ip_address: faker.internet.ip(),
            user_agent: faker.internet.userAgent(),
            device_type: faker.helpers.arrayElement([
                "mobile",
                "desktop",
                "tablet",
            ]),
        },
    };
};
export const generateTransactions = (count = 500, userIds = []) => {
    return Array.from({ length: count }, (_, index) => {
        const userId =
            userIds.length > 0 ? faker.helpers.arrayElement(userIds) : null;
        return generateTransaction(userId, index);
    });
};
