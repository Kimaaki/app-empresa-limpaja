import emailjs from '@emailjs/browser';

export interface ServiceFormData {
  name: string;
  phone: string;
  user_email: string; // Campo de e-mail adicionado
  address: string;
  services: string[];
  material: string;
  dirtLevel: string;
  distance: string;
  totalPrice: string;
}

export async function sendServiceRequest(formData: ServiceFormData) {
  const { name, phone, user_email, address, services, material, dirtLevel, distance, totalPrice } = formData;

  const templateParams = {
    user_name: name || "Não informado",
    user_phone: phone || "Não informado",
    user_email: user_email || "Não informado",
    user_address: address || "Não informado",
    service_type: Array.isArray(services) ? services.join(", ") : services || "Não informado",
    materials: material || "Não informado",
    dirt_level: dirtLevel || "Não informado",
    distance: distance || "Não informado",
    total_price: totalPrice ? `${totalPrice} €` : "Não informado",
  };

  try {
    const result = await emailjs.send(
      "service_nesit1c",
      "template_9kmumou",
      templateParams,
      "3VUWfNyzFF2LAZegT"
    );

    console.log("✅ E-mail enviado com sucesso via EmailJS!", result.text);
    return true;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    return false;
  }
}

export function initEmailJS() {
  emailjs.init("3VUWfNyzFF2LAZegT");
  console.log("EmailJS inicializado.");
}