import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, UserCog, MoreVertical, Pencil, Trash2, Power } from 'lucide-react';
import { Button, Card, Tag, Modal, Input, Select, Dropdown, App } from 'antd';
import type { MenuProps } from 'antd';
import { Gerente, TiposGerente } from '@/types/manager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const mockGerentes: Gerente[] = [
  { id: 'ger-1', nome: 'Carlos Oliveira', tipo: 'GERENTE', senha: '******', restaurante_ref: 'rest-1', ativo: true, data_ultimo_acesso: new Date('2024-01-10'), data_criacao: new Date('2022-01-15') },
  { id: 'ger-2', nome: 'Fernanda Costa', tipo: 'AUXILIAR', senha: '******', restaurante_ref: 'rest-1', ativo: true, data_ultimo_acesso: new Date('2024-01-12'), data_criacao: new Date('2023-06-20') },
  { id: 'ger-3', nome: 'Roberto Lima', tipo: 'AUXILIAR', senha: '******', restaurante_ref: 'rest-1', ativo: false, data_criacao: new Date('2023-09-10') },
];

const ManagersScreen = () => {
  const navigate = useNavigate();
  const [gerentes, setGerentes] = useState<Gerente[]>(mockGerentes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGerente, setSelectedGerente] = useState<Gerente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: '', tipo: 'AUXILIAR' as TiposGerente, senha: '', confirmarSenha: '' });
  const { message, modal } = App.useApp();

  const resetForm = () => { setFormData({ nome: '', tipo: 'AUXILIAR', senha: '', confirmarSenha: '' }); setSelectedGerente(null); setIsEditing(false); };

  const handleOpenDialog = (gerente?: Gerente) => {
    if (gerente) { setSelectedGerente(gerente); setIsEditing(true); setFormData({ nome: gerente.nome, tipo: gerente.tipo, senha: '', confirmarSenha: '' }); }
    else resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nome.trim()) { message.error('Nome é obrigatório'); return; }
    if (!isEditing && !formData.senha) { message.error('Senha é obrigatória'); return; }
    if (formData.senha && formData.senha !== formData.confirmarSenha) { message.error('As senhas não coincidem'); return; }
    if (formData.senha && formData.senha.length < 6) { message.error('A senha deve ter pelo menos 6 caracteres'); return; }

    if (isEditing && selectedGerente) {
      setGerentes(prev => prev.map(g => g.id === selectedGerente.id ? { ...g, nome: formData.nome, tipo: formData.tipo, ...(formData.senha && { senha: formData.senha }) } : g));
      message.success('Usuário atualizado com sucesso!');
    } else {
      setGerentes(prev => [...prev, { id: `ger-${Date.now()}`, nome: formData.nome, tipo: formData.tipo, senha: formData.senha, restaurante_ref: 'rest-1', ativo: true, data_criacao: new Date() }]);
      message.success('Usuário cadastrado com sucesso!');
    }
    setIsDialogOpen(false); resetForm();
  };

  const handleToggleAtivo = (gerente: Gerente) => {
    setGerentes(prev => prev.map(g => g.id === gerente.id ? { ...g, ativo: !g.ativo } : g));
    message.success(gerente.ativo ? 'Usuário desativado' : 'Usuário ativado');
  };

  const handleDelete = (gerente: Gerente) => {
    modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja excluir o usuário "${gerente.nome}"? Esta ação não pode ser desfeita.`,
      okText: 'Excluir', okButtonProps: { danger: true }, cancelText: 'Cancelar',
      onOk: () => { setGerentes(prev => prev.filter(g => g.id !== gerente.id)); message.success('Usuário excluído com sucesso!'); },
    });
  };

  const getMenuItems = (gerente: Gerente): MenuProps['items'] => [
    { key: 'edit', label: 'Editar', icon: <Pencil style={{ width: 16, height: 16 }} />, onClick: () => handleOpenDialog(gerente) },
    { key: 'toggle', label: gerente.ativo ? 'Desativar' : 'Ativar', icon: <Power style={{ width: 16, height: 16 }} />, onClick: () => handleToggleAtivo(gerente) },
    { key: 'delete', label: 'Excluir', icon: <Trash2 style={{ width: 16, height: 16 }} />, danger: true, onClick: () => handleDelete(gerente) },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>
      <div style={{ background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button type="text" icon={<ArrowLeft style={{ width: 20, height: 20 }} />} onClick={() => navigate('/settings')} />
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Gerentes e Auxiliares</h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Gerencie os usuários do sistema</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Button type="primary" block icon={<Plus style={{ width: 16, height: 16 }} />} onClick={() => handleOpenDialog()}>Cadastrar Novo Usuário</Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {gerentes.map(gerente => (
            <Card key={gerente.id} style={{ opacity: gerente.ativo ? 1 : 0.6 }} styles={{ body: { padding: 16 } }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(45,184,164,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCog style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 500 }}>{gerente.nome}</span>
                      <Tag color={gerente.tipo === 'GERENTE' ? 'cyan' : 'default'}>{gerente.tipo}</Tag>
                      {!gerente.ativo && <Tag>Inativo</Tag>}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Criado em {format(gerente.data_criacao, "dd/MM/yyyy", { locale: ptBR })}</p>
                    {gerente.data_ultimo_acesso && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Último acesso: {format(gerente.data_ultimo_acesso, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>}
                  </div>
                </div>
                <Dropdown menu={{ items: getMenuItems(gerente) }} trigger={['click']}>
                  <Button type="text" icon={<MoreVertical style={{ width: 16, height: 16 }} />} />
                </Dropdown>
              </div>
            </Card>
          ))}

          {gerentes.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-secondary)' }}>
              <UserCog style={{ width: 48, height: 48, margin: '0 auto 8px', opacity: 0.5 }} />
              <p>Nenhum usuário cadastrado</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={isDialogOpen} onCancel={() => { setIsDialogOpen(false); resetForm(); }} title={isEditing ? 'Editar Usuário' : 'Cadastrar Novo Usuário'} footer={[
        <Button key="cancel" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancelar</Button>,
        <Button key="save" type="primary" onClick={handleSubmit}>{isEditing ? 'Salvar' : 'Cadastrar'}</Button>,
      ]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Nome</label><Input placeholder="Nome do usuário" value={formData.nome} onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Tipo</label><Select value={formData.tipo} onChange={(v: TiposGerente) => setFormData(prev => ({ ...prev, tipo: v }))} style={{ width: '100%' }} options={[{ value: 'GERENTE', label: 'Gerente' }, { value: 'AUXILIAR', label: 'Auxiliar' }]} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{isEditing ? 'Nova Senha (deixe vazio para manter)' : 'Senha'}</label><Input.Password placeholder="******" value={formData.senha} onChange={e => setFormData(prev => ({ ...prev, senha: e.target.value }))} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Confirmar Senha</label><Input.Password placeholder="******" value={formData.confirmarSenha} onChange={e => setFormData(prev => ({ ...prev, confirmarSenha: e.target.value }))} /></div>
        </div>
      </Modal>
    </div>
  );
};

export default ManagersScreen;
