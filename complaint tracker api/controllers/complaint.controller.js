import { complaints, idCounter } from '../data/complaints.data.js';

const VALID_CATEGORIES = [
    'Road Maintenance',
    'Street Lighting',
    'Waste Management',
    'Water Supply',
    'Drainage',
    'Public Safety',
    'Parks & Recreation',
    'Noise Pollution',
    'Illegal Construction',
    'Other'
];

const VALID_PRIORITIES = ['low', 'medium', 'high', 'critical'];
const VALID_STATUSES = ['pending', 'resolved', 'rejected'];

export const getAllComplaints = (req, res) => {
    const { status, ward, priority } = req.query;
    let filteredComplaints = [...complaints];

    if (status) {
        filteredComplaints = filteredComplaints.filter(c => c.status === status);
    }

    if (ward) {
        filteredComplaints = filteredComplaints.filter(c => c.ward === ward);
    }

    if (priority) {
        filteredComplaints = filteredComplaints.filter(c => c.priority === priority);
    }

    res.status(200).json({
        success: true,
        count: filteredComplaints.length,
        totalComplaints: complaints.length,
        data: filteredComplaints
    });
};

export const createComplaint = (req, res) => {
    const {
        title,
        description,
        category,
        location,
        ward,
        priority,
        citizenName,
        citizenContact,
        citizenPhone
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Title and description are required'
        });
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
            success: false,
            message: 'Valid category is required'
        });
    }

    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }

    if (!citizenName || !citizenContact) {
        return res.status(400).json({
            success: false,
            message: 'Citizen name and contact are required'
        });
    }

    const complaintPriority = priority || 'medium';
    if (!VALID_PRIORITIES.includes(complaintPriority)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid priority'
        });
    }

    const newComplaint = {
        id: idCounter.value,
        title,
        description,
        category,
        location,
        ward: ward || 'Unassigned',
        priority: complaintPriority,
        citizenName,
        citizenContact,
        citizenPhone: citizenPhone || null,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    complaints.push(newComplaint);
    idCounter.value++;

    res.status(201).json({
        success: true,
        message: 'Complaint registered successfully',
        data: newComplaint
    });
};

export const updateComplaintStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const complaintId = parseInt(id);

    if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Valid status is required'
        });
    }

    const complaint = complaints.find(c => c.id === complaintId);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.updatedAt = new Date();

    res.status(200).json({
        success: true,
        message: `Status updated from ${oldStatus} to ${status}`,
        data: complaint
    });
};

export const getComplaintById = (req, res) => {
    const { id } = req.params;
    const complaintId = parseInt(id);
    const complaint = complaints.find(c => c.id === complaintId);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    res.status(200).json({
        success: true,
        data: complaint
    });
};

export const deleteComplaint = (req, res) => {
    const { id } = req.params;
    const complaintId = parseInt(id);
    const complaintIndex = complaints.findIndex(c => c.id === complaintId);

    if (complaintIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    const deletedComplaint = complaints.splice(complaintIndex, 1)[0];

    res.status(200).json({
        success: true,
        message: 'Complaint deleted',
        data: deletedComplaint
    });
};

export const getComplaintStats = (req, res) => {
    const stats = {
        total: complaints.length,
        byStatus: {},
        byCategory: {},
        byPriority: {},
        byWard: {}
    };

    complaints.forEach(complaint => {
        stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
        stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
        stats.byPriority[complaint.priority] = (stats.byPriority[complaint.priority] || 0) + 1;
        stats.byWard[complaint.ward] = (stats.byWard[complaint.ward] || 0) + 1;
    });

    res.status(200).json({
        success: true,
        data: stats
    });
};
