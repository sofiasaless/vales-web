import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useEmployee } from '@/hooks/useEmployee';
import { usePayment } from '@/hooks/usePayment';
import { CloudinaryService } from '@/services/clodinary.service';
import { PagamentoPostRequestBody } from '@/types/pagamento.type';
import { Button as ButtonAnt } from 'antd';
import { CheckCircle, SignatureIcon, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SignaturePad from 'react-signature-pad-wrapper';
import { toast } from 'sonner';

const PaymentSignatureScreen = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const paymentBody = location.state as PagamentoPostRequestBody;
  const navigate = useNavigate();

  const sigPad = useRef<SignaturePad | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  const clear = useCallback(() => {
    sigPad.current?.clear();
    setSignatureUrl(null);
  }, []);

  const save = useCallback(() => {
    if (sigPad.current) {
      const dataURL = sigPad.current.toDataURL('image/png');
      setSignatureUrl(dataURL);
      toast.success(`Assinatura salva com sucesso!`);
    }
  }, []);

  const { pay } = usePayment()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleFinalize = async () => {
    try {
      setIsLoading(true);
      if (!signatureUrl) {
        return toast.error("A assinatura é obrigatória para finalizar o contrato.");
      }

      const signatureLink = await CloudinaryService.sendPicture(signatureUrl);
      paymentBody.assinatura = signatureLink;

      await pay.mutateAsync({ employeeId: id, body: paymentBody })
    } catch (error) {
      toast.error(`Erro ao realizar contratação: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pay.isPending) return;

    if (pay.isSuccess) {
      toast.success('Pagamento confirmado com sucesso!');
      navigate('/', { replace: true });
    }

    if (pay.isError) {
      toast.error(`Erro ao pagar funcionário: ${pay.error}`);
    }
  }, [pay.isPending]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader
        title={`Assinatura para pagamento`}
        subtitle={'Assine dentro da área delimitada abaixo'}
        showBack
      />

      <div className="py-4 max-w-lg mx-auto space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white overflow-hidden">
          <SignaturePad
            ref={sigPad}
            options={{
              penColor: 'black',
              minWidth: 1,
              maxWidth: 2,
            }}
            canvasProps={{
              style: {
                width: '100%',
                height: '500px',
              },
            }}
          />
        </div>

        <div className="px-4 flex gap-4">
          <ButtonAnt
            danger
            onClick={clear}
            icon={<Trash2 size={16} />}
            className="w-full flex items-center justify-center"
          >
            Limpar
          </ButtonAnt>

          <ButtonAnt
            type="primary"
            onClick={save}
            icon={<CheckCircle size={16} />}
            className="w-full flex items-center justify-center"
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Confirmar assinatura
          </ButtonAnt>
        </div>

        <div className="px-4">
          <Button
            className="w-full h-12 text-base"
            onClick={handleFinalize}
            disabled={!signatureUrl || isLoading}
          >
            <SignatureIcon className="w-5 h-5 mr-2" />
            Confirmar pagamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSignatureScreen;
