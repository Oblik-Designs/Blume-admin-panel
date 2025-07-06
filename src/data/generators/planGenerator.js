import { faker } from "@faker-js/faker";
const generateObjectId = () => {
    return faker.database.mongodbObjectId();
};
const planTitles = [
    "Coffee & Networking Session",
    "Hiking Adventure Trail",
    "Cooking Class: Italian Cuisine",
    "Photography Workshop",
    "Book Club Discussion",
    "Yoga & Meditation",
    "Wine Tasting Experience",
    "Art Gallery Tour",
    "Language Exchange Meetup",
    "Startup Pitch Night",
    "Board Game Evening",
    "Farmers Market Visit",
    "Live Music Session",
    "Tech Talk & Demo",
    "Fitness Bootcamp",
    "Creative Writing Circle",
    "Investment Workshop",
    "Dance Class Beginner",
    "Pottery Making Session",
    "Food Truck Tour",
];
const planTypes = [1, 2, 2, 2, 3]; // Weighted towards type 2 (joiners pay)
const planStatuses = [
    "draft",
    "published",
    "applications_open",
    "applications_open",
    "applications_closed",
    "active",
    "completed",
    "completed",
    "completed",
]; // Weighted towards completed
export const generatePlan = (hostId = null, index = 0) => {
    const type = faker.helpers.arrayElement(planTypes);
    const status = faker.helpers.arrayElement(planStatuses);
    const maxParticipants = faker.number.int({ min: 2, max: 20 });
    const currentParticipants =
        status === "completed"
            ? maxParticipants
            : faker.number.int({ min: 0, max: maxParticipants });
    const startDate =
        status === "completed"
            ? faker.date.past({ years: 1 })
            : faker.date.future({ years: 0.5 });
    const duration = faker.number.int({ min: 1, max: 8 }); // hours
    const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
    const applicationCloseDate = new Date(
        startDate.getTime() - 24 * 60 * 60 * 1000
    ); // 24 hours before
    const minBP =
        type === 2
            ? faker.number.int({ min: 100, max: 5000 })
            : type === 1
              ? faker.number.int({ min: 200, max: 2000 })
              : null;
    return {
        id: generateObjectId(),
        host_id: hostId || generateObjectId(),
        template_id: faker.datatype.boolean(0.3) ? generateObjectId() : null,
        title: faker.helpers.arrayElement(planTitles),
        description: faker.lorem.paragraph({ min: 2, max: 4 }),
        images: Array.from(
            { length: faker.number.int({ min: 1, max: 4 }) },
            () => faker.image.urlLoremFlickr({ category: "people" })
        ),
        start_date: startDate,
        end_date: endDate,
        start_time: startDate,
        end_time: endDate,
        location: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zip: faker.location.zipCode(),
            country: "US",
        },
        type: type,
        status: status,
        application_close_date: applicationCloseDate,
        view_mode: faker.helpers.arrayElement([
            "public",
            "public",
            "public",
            "private",
        ]),
        gender: faker.datatype.boolean(0.7)
            ? null
            : faker.helpers.arrayElements(["male", "female", "other"], {
                  min: 1,
                  max: 2,
              }),
        min_age: faker.datatype.boolean(0.6)
            ? faker.number.int({ min: 18, max: 25 })
            : null,
        max_age: faker.datatype.boolean(0.6)
            ? faker.number.int({ min: 30, max: 65 })
            : null,
        max_participants: maxParticipants,
        current_participants: currentParticipants,
        min_bp_per_participant: minBP,
        min_profile_level: faker.helpers.arrayElement([null, null, 1, 2, 3]),
        tags: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () =>
            generateObjectId()
        ),
        created_at: faker.date.past({ years: 1 }),
        updated_at: faker.date.recent(),
        total_applications:
            type === 3
                ? faker.number.int({
                      min: maxParticipants,
                      max: maxParticipants * 3,
                  })
                : faker.number.int({
                      min: currentParticipants,
                      max: maxParticipants * 2,
                  }),
        avg_rating:
            status === "completed"
                ? faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 })
                : null,
        total_revenue_bp:
            type === 2 && status === "completed"
                ? currentParticipants * minBP
                : 0,
        is_sponsored: faker.datatype.boolean(0.1), // 10% sponsored plans
        sponsor_info: faker.datatype.boolean(0.1) ? faker.company.name() : null,
    };
};
export const generatePlans = (count = 100, hostIds = []) => {
    return Array.from({ length: count }, (_, index) => {
        const hostId =
            hostIds.length > 0 ? faker.helpers.arrayElement(hostIds) : null;
        return generatePlan(hostId, index);
    });
};
