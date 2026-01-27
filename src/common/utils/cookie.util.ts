export const CookiesOptionsToken = () => {
    return {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 60000), // 2 minutes
    }
}