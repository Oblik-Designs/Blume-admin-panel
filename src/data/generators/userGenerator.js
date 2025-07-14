import { faker } from "@faker-js/faker";
const generateObjectId = () => {
    return faker.database.mongodbObjectId();
};
export const generateUser = (index = 0) => {
    const level = faker.helpers.arrayElement([1, 1, 2, 2, 3]); // Weighted towards lower levels
    const subscription = faker.helpers.arrayElement([
        "Plan_1",
        "Plan_1",
        "Plan_2",
        "Plan_3",
    ]);
    const isActive = faker.datatype.boolean(0.85); // 85% active users
    const bpSpent = faker.number.int({
        min: level === 1 ? 0 : level === 2 ? 1000 : 5000,
        max: level === 1 ? 2000 : level === 2 ? 10000 : 50000,
    });
    const plansJoined = faker.number.int({
        min: level === 1 ? 0 : level === 2 ? 5 : 20,
        max: level === 1 ? 15 : level === 2 ? 50 : 150,
    });
    const verificationStatus =
        level === 3
            ? faker.helpers.arrayElement([
                  "approved",
                  "approved",
                  "pending",
                  "requires_attention",
              ])
            : faker.helpers.arrayElement([
                  "approved",
                  "approved",
                  "approved",
                  "pending",
              ]);
    const createdAt = faker.date.past({ years: 2 });
    const lastActive = faker.date.between({ from: createdAt, to: new Date() });
    return {
        id: generateObjectId(),
        username: faker.internet.username().toLowerCase(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number("+1##########"),
        password: faker.internet.password(),
        status: isActive
            ? "active"
            : faker.helpers.arrayElement(["inactive", "banned"]),
        profile_image: [faker.image.avatar()],
        bio: faker.lorem.paragraph(),
        highlight: faker.lorem.sentence(),
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip: faker.location.zipCode(),
            country: "US",
        },
        dob: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
        gender: faker.helpers.arrayElement(["male", "female", "other"]),
        interests: Array.from(
            { length: faker.number.int({ min: 2, max: 8 }) },
            () => generateObjectId()
        ),
        profile_level: level,
        profile_points: bpSpent + faker.number.int({ min: 0, max: 5000 }),
        wallet: {
            beens_points: faker.number.int({ min: 0, max: 25000 }),
            escrow_beens_points: faker.number.int({ min: 0, max: 5000 }),
        },
        current_subscription: subscription,
        subscription_expires_at:
            subscription !== "Plan_1" ? faker.date.future({ years: 1 }) : null,
        traits: {
            polite: faker.number.int({ min: 0, max: 100 }),
            funny: faker.number.int({ min: 0, max: 100 }),
            reliable: faker.number.int({ min: 0, max: 100 }),
            charismatic: faker.number.int({ min: 0, max: 100 }),
        },
        total_reviews: faker.number.int({ min: 0, max: plansJoined }),
        verification: {
            phone_verified_at: faker.date.between({
                from: createdAt,
                to: lastActive,
            }),
            email_verified_at: faker.date.between({
                from: createdAt,
                to: lastActive,
            }),
            legal_documents_verified_at:
                level === 3 ? faker.date.recent() : null,
            address_verified_at: level >= 2 ? faker.date.recent() : null,
            status: verificationStatus,
        },
        created_at: createdAt,
        updated_at: lastActive,
        last_active: lastActive,
        total_bp_spent: bpSpent,
        total_plans_joined: plansJoined,
        total_plans_hosted: faker.number.int({
            min: 0,
            max: Math.floor(plansJoined / 3),
        }),
    };
};
export const generateUsers = (count = 50) => {
    return Array.from({ length: count }, (_, index) => generateUser(index));
};
