export interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export const isResendConfigured = true; // Assumed configured on backend

export async function sendContactEmail(data: ContactFormData) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error: ${response.status}`);
        }

        return result.data;
    } catch (error) {
        console.error("Failed to send email via API:", error);
        throw error;
    }
}
