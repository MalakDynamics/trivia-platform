const determineBuzzWinner = (userId) => {
    if (buzzWinner.length == 0) {
        buzzWinner.push(userId);
        return true;
    } else {
        buzzWinner.push(userId);
        return false;
    };
};