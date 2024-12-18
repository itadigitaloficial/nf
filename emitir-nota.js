import axios from 'axios';

const empresaId = 'B1EA5ABB-7853-4C12-91CF-82433E2B0B00';

const enotasApi = axios.create({
  baseURL: 'https://api.enotasgw.com.br/v1',
  headers: {
    'Authorization': `Basic NjI1ZDRjNmMtNzg4Ny00MTM1LWFlZGUtYjA0ODIyMjEwYjAw`,
    'Content-Type': 'application/json'
  }
});

const notaFiscal = {
  tipo: 'NFS-e',
  valorTotal: 0.50,
  servico: {
    descricao: 'Teste de emissão de nota fiscal',
    codigoServico: '1.05' // Código genérico para teste
  },
  tomador: {
    razaoSocial: 'Cliente Teste',
    email: 'teste@teste.com',
    cpfCnpj: '00000000000'
  }
};

async function emitirNota() {
  try {
    const response = await enotasApi.post(`/empresas/${empresaId}/nfes`, notaFiscal);
    console.log('Nota fiscal emitida com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao emitir nota fiscal:', error.response?.data || error.message);
  }
}

emitirNota();
