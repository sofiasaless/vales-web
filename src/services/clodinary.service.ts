import axios from "axios";

export const CloudinaryService = {
  async sendPicture(imagem: string | File) {
    if (!imagem) return '';

    const cloudName = import.meta.env.VITE_CLOUDINARY_NAME;

    const formData = new FormData();
    formData.append('file', imagem);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      console.log('upload realizado com sucesso!')
      return response.data.secure_url;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      return '';
    }
  },

}