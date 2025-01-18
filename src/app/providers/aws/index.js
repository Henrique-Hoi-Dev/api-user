const AWS = require('aws-sdk');
require('dotenv/config');

AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  correctClockSkew: true,
});

const s3 = new AWS.S3();
const sns = new AWS.SNS();

export const sendSMS = async ({ phoneNumber, resetCode }) => {
  const params = {
    Message:
      `Olá,\n\n` +
      `Você solicitou uma redefinição de senha em LOGBOOK. Use o código de verificação abaixo para prosseguir com a redefinição:\n\n` +
      `*Código de Verificação*: *${resetCode}*\n\n` +
      `Por questões de segurança, este código é válido por apenas 15 minutos. Não compartilhe este código com ninguém.\n\n` +
      `Se você não solicitou uma redefinição de senha, por favor ignore esta mensagem.`,
    PhoneNumber: phoneNumber, // Número do celular do usuário, no formato +5511999999999
  };

  try {
    const data = await sns.publish(params).promise();
    console.log('Código de redefinição enviado com sucesso!', data);
    return data;
  } catch (error) {
    console.error('Erro ao enviar código de redefinição:', error);
    return error;
  }
};

export const sendFile = async ({ file, body }) => {
  try {
    const { buffer: data, mimetype, name } = file;
    const { Location } = await s3
      .upload({
        Body: data,
        Key: `${body.category}/${name}`,
        ContentType: mimetype,
        ACL: 'private',
        Bucket: process.env.S3_BUCKET_NAME,
      })
      .promise();

    console.log('Integration Location:', Location);
    return Location;
  } catch (error) {
    throw error;
  }
};

export const getFile = ({ filename, category }) => {
  return s3
    .getObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${category}/${filename}`,
    })
    .promise();
};

export const deleteFile = ({ filename, category }) => {
  return s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${category}/${filename}`,
    })
    .promise();
};
