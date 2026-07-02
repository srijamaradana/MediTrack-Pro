const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`,
        requiredRoles: roles,
        currentRole: req.user.role,
      });
    }

    next();
  };
};

// Specific role checks
const isPatient = roleCheck('patient');
const isDoctor = roleCheck('doctor', 'admin', 'superadmin');
const isAdmin = roleCheck('admin', 'superadmin');
const isSuperAdmin = roleCheck('superadmin');
const isPatientOrDoctor = roleCheck('patient', 'doctor');
const isDoctorOrAdmin = roleCheck('doctor', 'admin', 'superadmin');

// Role-based access control with user ID verification
const allowIfOwnUser = (paramName = 'id') => {
  return (req, res, next) => {
    const targetUserId = req.params[paramName];
    const currentUser = req.user;

    // Admin can access any user
    if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
      return next();
    }

    // Users can access their own data
    if (currentUser._id.toString() === targetUserId || currentUser._id.toString() === req.user._id.toString()) {
      return next();
    }

    // Doctor can access their patients
    if (currentUser.role === 'doctor') {
      // Check if this user is a patient of this doctor
      // This requires the doctor model to be imported
      // For now, let's implement this check
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data or your patients\' data.',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.',
    });
  };
};

module.exports = {
  roleCheck,
  isPatient,
  isDoctor,
  isAdmin,
  isSuperAdmin,
  isPatientOrDoctor,
  isDoctorOrAdmin,
  allowIfOwnUser,
};