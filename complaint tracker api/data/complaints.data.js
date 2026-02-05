const complaints = [
    {
        id: 1,
        title: "Broken Street Light on Main Street",
        description: "The street light near the park has been non-functional for a week, causing safety concerns.",
        category: "Street Lighting",
        location: "Main Street, Near Central Park",
        ward: "Ward 5",
        priority: "high",
        citizenName: "John Doe",
        citizenContact: "john.doe@email.com",
        citizenPhone: "+1234567890",
        status: "pending",
        createdAt: new Date("2026-02-01T10:00:00Z"),
        updatedAt: new Date("2026-02-01T10:00:00Z")
    },
    {
        id: 2,
        title: "Pothole on Highway 101",
        description: "Large pothole causing vehicle damage and traffic hazards.",
        category: "Road Maintenance",
        location: "Highway 101, Mile Marker 15",
        ward: "Ward 3",
        priority: "critical",
        citizenName: "Jane Smith",
        citizenContact: "jane.smith@email.com",
        citizenPhone: "+1234567891",
        status: "pending",
        createdAt: new Date("2026-01-30T14:30:00Z"),
        updatedAt: new Date("2026-02-02T09:15:00Z")
    },
    {
        id: 3,
        title: "Garbage Not Collected",
        description: "Garbage has not been collected for 3 days in our neighborhood.",
        category: "Waste Management",
        location: "Oak Avenue, Block B",
        ward: "Ward 7",
        priority: "medium",
        citizenName: "Mike Johnson",
        citizenContact: "mike.j@email.com",
        citizenPhone: "+1234567892",
        status: "resolved",
        createdAt: new Date("2026-01-28T08:00:00Z"),
        updatedAt: new Date("2026-01-29T16:00:00Z")
    }
];

const idCounter = { value: 4 };

export { complaints, idCounter };

