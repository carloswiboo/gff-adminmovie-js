import { Vimeo } from '@vimeo/vimeo';

const clientVimeoGff = new Vimeo(
    process.env.VIMEO_CLIENT_ID,     // client ID de tu app Vimeo
    process.env.VIMEO_CLIENT_SECRET, // client secret de tu app Vimeo
    process.env.VIMEO_TOKEN          // token de acceso personal
);

export default clientVimeoGff;