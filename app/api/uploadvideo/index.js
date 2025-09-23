import clientVimeoGff from '@/helpers/VimeoCreatorHelper';

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { filename, size, name, description, privacy } = req.body || {};

    debugger;
    if (!Number.isFinite(size) || size <= 0) {
        return res.status(400).json({ error: 'Missing/invalid file size' });
    }

    // Verificar que las credenciales de Vimeo estén configuradas
    if (!process.env.VIMEO_CLIENT_ID || !process.env.VIMEO_CLIENT_SECRET || !process.env.VIMEO_TOKEN) {
        console.error('Missing Vimeo credentials. Please check your environment variables.');
        return res.status(500).json({ 
            error: 'Server configuration error: Missing Vimeo credentials',
            developer_message: 'Please set VIMEO_CLIENT_ID, VIMEO_CLIENT_SECRET, and VIMEO_TOKEN in your environment variables.'
        });
    }

    clientVimeoGff.request(
        {
            method: 'POST',
            path: '/me/videos', // <-- CORRECTO
            query: {
                name: name || filename || 'Untitled',
                description: description || '',
                privacy: { view: privacy || 'unlisted' }, // 'anybody' | 'nobody' | 'unlisted'
                upload: {
                    approach: 'tus',
                    size, // obligatorio para TUS
                },
            },
        },
        (err, body) => {

            debugger;
            if (err) {
                console.error('Vimeo API Error:', err);
                
                // Manejar errores específicos de Vimeo
                let errorMessage = 'Error uploading to Vimeo';
                let statusCode = 500;
                
                if (err.error_code === 8003) {
                    errorMessage = 'Vimeo authentication failed. Please check your credentials.';
                    statusCode = 401;
                } else if (err.error_code === 8001) {
                    errorMessage = 'Invalid request to Vimeo API.';
                    statusCode = 400;
                } else if (err.error) {
                    errorMessage = err.error;
                }
                
                return res.status(statusCode).json({ 
                    error: errorMessage,
                    developer_message: err.developer_message || err.message || 'Unknown Vimeo API error',
                    error_code: err.error_code
                });
            }
            return res.status(200).json({
                uploadLink: body?.upload?.upload_link,
                videoUri: body?.uri, // p.ej. "/videos/123456789"
            });
        }
    );
}