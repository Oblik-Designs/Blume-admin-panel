import { faker } from "@faker-js/faker";
const generateObjectId = () => {
    return faker.database.mongodbObjectId();
};
const applicationTypes = ["bidding", "gift", "invite"];
const applicationStatuses = ["pending", "accepted", "accepted", "rejected"]; // Weighted towards accepted
export const generateApplication = (
    planId = null,
    userId = null,
    index = 0
) => {
    const type = faker.helpers.arrayElement(applicationTypes);
    const status = faker.helpers.arrayElement(applicationStatuses);
    const createdAt = faker.date.past({ years: 0.5 });
    const bidAmount =
        type === "bidding" ? faker.number.int({ min: 500, max: 10000 }) : null;
    return {
        id: generateObjectId(),
        plan_id: planId || generateObjectId(),
        user_id: userId || generateObjectId(),
        bid_amount: bidAmount,
        application_type: type,
        status: status,
        message:
            type === "invite"
                ? faker.lorem.sentence()
                : faker.lorem.paragraph(),
        created_at: createdAt,
        updated_at:
            status === "pending"
                ? createdAt
                : faker.date.between({ from: createdAt, to: new Date() }),
        accepted_at:
            status === "accepted"
                ? faker.date.between({ from: createdAt, to: new Date() })
                : null,
        rejected_at:
            status === "rejected"
                ? faker.date.between({ from: createdAt, to: new Date() })
                : null,
        rejection_reason:
            status === "rejected"
                ? faker.helpers.arrayElement([
                      "Plan is full",
                      "Does not meet requirements",
                      "Profile incomplete",
                      "Insufficient level",
                  ])
                : null,
    };
};
export const generateApplications = (
    count = 200,
    planIds = [],
    userIds = []
) => {
    return Array.from({ length: count }, (_, index) => {
        const planId =
            planIds.length > 0 ? faker.helpers.arrayElement(planIds) : null;
        const userId =
            userIds.length > 0 ? faker.helpers.arrayElement(userIds) : null;
        return generateApplication(planId, userId, index);
    });
};
