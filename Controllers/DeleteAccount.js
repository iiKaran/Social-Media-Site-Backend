const User = require("../models/User");
 const deleteInactiveAccounts = async () => {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    try {
        // console.log("reqsues t")
        const users = await User.find({
            deletionRequest: { $exists: true },
            ddeletionRequest: { $lte: new Date(now - THIRTY_DAYS) }
        });

        for (const user of users) {
            await User.findByIdAndDelete(user._id);
            console.log(`Deleted user with ID: ${user._id}`);
        }
    } catch (err) {
        console.error("Error deleting inactive accounts:", err);
    }
};

module.exports = { deleteInactiveAccounts };