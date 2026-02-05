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
    console.log('[CONTROLLER] Fetching all city complaints');

    const { status, category, ward, priority } = req.query;

    let filteredComplaints = [...complaints];

    if (status) {
        filteredComplaints = filteredComplaints.filter(c => c.status === status);
    }

    if (category) {
        filteredComplaints = filteredComplaints.filter(c => c.category === category);
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
        filters: { status, category, ward, priority },
        data: filteredComplaints
    });
};

export const createComplaint = (req, res) => {
    console.log('[CONTROLLER] Creating new city complaint');

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
            message: 'Category is required'
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
            message: 'Citizen name and contact information are required'
        });
    }

    const complaintPriority = priority || 'medium';
    if (!VALID_PRIORITIES.includes(complaintPriority)) {
        return res.status(400).json({
            success: false,
            message: 'Priority must be one of: low, medium, high, critical'
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
        message: 'City complaint registered successfully',
        data: newComplaint
    });
};

export const updateComplaintStatus = (req, res) => {
    console.log('[CONTROLLER] Updating complaint status');

    const { id } = req.params;
    const { status } = req.body;
    const complaintId = parseInt(id);

    if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${VALID_STATUSES.join(', ')}`
        });
    }

    const complaint = complaints.find(c => c.id === complaintId);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${complaintId} not found`
        });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.updatedAt = new Date();

    res.status(200).json({
        success: true,
        message: `Complaint status updated from '${oldStatus}' to '${status}'`,
        data: complaint
    });
};

export const resolveComplaint = (req, res) => {
    console.log('[CONTROLLER] Resolving city complaint');

    const { id } = req.params;
    const complaintId = parseInt(id);

    const complaint = complaints.find(c => c.id === complaintId);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${complaintId} not found`
        });
    }

    if (complaint.status === 'resolved') {
        return res.status(400).json({
            success: false,
            message: 'Complaint is already resolved'
        });
    }

    complaint.status = 'resolved';
    complaint.updatedAt = new Date();

    res.status(200).json({
        success: true,
        message: 'City complaint resolved successfully',
        data: complaint
    });
};

export const getComplaintById = (req, res) => {
    console.log('[CONTROLLER] Fetching complaint by ID');

    const { id } = req.params;
    const complaintId = parseInt(id);

    const complaint = complaints.find(c => c.id === complaintId);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${complaintId} not found`
        });
    }

    res.status(200).json({
        success: true,
        data: complaint
    });
};

export const deleteComplaint = (req, res) => {
    console.log('[CONTROLLER] Deleting city complaint');

    const { id } = req.params;
    const complaintId = parseInt(id);

    const complaintIndex = complaints.findIndex(c => c.id === complaintId);

    if (complaintIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${complaintId} not found`
        });
    }

    const deletedComplaint = complaints.splice(complaintIndex, 1)[0];

    res.status(200).json({
        success: true,
        message: 'City complaint deleted successfully',
        data: deletedComplaint
    });
};

export const getComplaintStats = (req, res) => {
    console.log('[CONTROLLER] Fetching complaint statistics');

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
