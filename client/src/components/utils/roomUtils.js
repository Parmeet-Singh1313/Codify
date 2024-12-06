export const getRoomId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/editor\/([^/]+)/);
    return match ? match[1] : null;
};