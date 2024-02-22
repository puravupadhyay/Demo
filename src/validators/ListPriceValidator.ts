export function validateData(data) {
    if (data == null || data.data == null) {
        throw new Error("API returned unexpected response.")
    }
}