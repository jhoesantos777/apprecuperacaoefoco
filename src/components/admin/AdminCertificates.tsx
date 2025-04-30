
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Mail,
  Search,
  RefreshCcw,
  Eye,
  Settings,
  Calendar
} from "lucide-react";

interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issue_date: string;
  download_url?: string;
  user_name: string;
  course_name: string;
  user_email?: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  background_url: string;
  is_default: boolean;
}

export const AdminCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    {
      id: "default",
      name: "Modelo Padrão",
      background_url: "/certificate-template.jpg",
      is_default: true
    },
    {
      id: "elegant",
      name: "Modelo Elegante",
      background_url: "/certificate-template-2.jpg",
      is_default: false
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");

  // Simulate fetching certificates
  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      // This would be a real API call in production
      // For demo purposes, we'll use mock data
      const mockCertificates: Certificate[] = [
        {
          id: "cert-1",
          user_id: "user-1",
          course_id: "course-1",
          issue_date: new Date().toISOString(),
          user_name: "João Silva",
          course_name: "Fundamentos da Recuperação",
          user_email: "joao@example.com"
        },
        {
          id: "cert-2",
          user_id: "user-2",
          course_id: "course-2",
          issue_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Maria Oliveira",
          course_name: "Prevenção de Recaídas",
          user_email: "maria@example.com"
        },
        {
          id: "cert-3",
          user_id: "user-3",
          course_id: "course-3",
          issue_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          user_name: "Pedro Santos",
          course_name: "Construindo Novos Hábitos",
          user_email: "pedro@example.com"
        }
      ];
      
      setTimeout(() => {
        setCertificates(mockCertificates);
        setLoading(false);
      }, 500); // Simulate API delay
      
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error("Falha ao carregar certificados");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handlePreviewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setShowPreview(true);
  };

  const handleSendCertificate = (certificate: Certificate) => {
    // This would send the certificate in a real application
    toast.success(`Certificado enviado para ${certificate.user_email}`);
  };

  const handleGenerateCertificate = (certificate: Certificate) => {
    // This would generate a PDF certificate in a real application
    toast.success("Certificado gerado com sucesso");
    
    // Update the certificate with a mock download URL
    const updatedCertificates = certificates.map(c => {
      if (c.id === certificate.id) {
        return {
          ...c,
          download_url: `https://example.com/certificates/${c.id}.pdf`
        };
      }
      return c;
    });
    
    setCertificates(updatedCertificates);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // This would download the certificate in a real application
    toast.success("Iniciando download do certificado");
  };

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
  };

  const handleSaveTemplateSettings = () => {
    toast.success("Configurações do modelo de certificado salvas com sucesso");
    setShowSettings(false);
  };

  const filteredCertificates = certificates.filter(certificate => 
    certificate.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    certificate.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Gerenciar Certificados</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCertificates}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou curso"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-black">Carregando certificados...</p>
        </div>
      ) : filteredCertificates.length === 0 ? (
        <div className="flex justify-center py-10">
          <p className="text-black">Nenhum certificado encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="bg-white/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-black text-lg">{certificate.course_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-black">
                  <p><strong>Aluno:</strong> {certificate.user_name}</p>
                  <p><strong>Email:</strong> {certificate.user_email}</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Emitido em: {new Date(certificate.issue_date).toLocaleDateString('pt-BR')}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePreviewCertificate(certificate)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                
                {certificate.download_url ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadCertificate(certificate)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleGenerateCertificate(certificate)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Gerar
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSendCertificate(certificate)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Enviar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>Visualização de Certificado</DialogTitle>
            <DialogDescription>
              Pré-visualização do certificado para {selectedCertificate?.user_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 border p-2">
            <div 
              className="aspect-video bg-contain bg-center bg-no-repeat p-8 flex flex-col justify-center items-center text-center"
              style={{ 
                backgroundImage: `url(${templates.find(t => t.id === selectedTemplate)?.background_url || '/certificate-template.jpg'})`,
                backgroundSize: 'cover'
              }}
            >
              <h2 className="text-2xl font-bold mb-6">Certificado de Conclusão</h2>
              <p className="text-lg mb-4">Certificamos que</p>
              <p className="text-xl font-bold mb-4">{selectedCertificate?.user_name}</p>
              <p className="text-lg mb-4">concluiu com êxito o curso</p>
              <p className="text-xl font-bold mb-8">{selectedCertificate?.course_name}</p>
              <p className="text-md mb-2">Emitido em {selectedCertificate ? new Date(selectedCertificate.issue_date).toLocaleDateString('pt-BR') : ''}</p>
              <div className="border-t border-gray-300 w-48 mt-8 pt-2">
                <p className="text-sm">Assinatura</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Fechar
            </Button>
            {selectedCertificate && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handleGenerateCertificate(selectedCertificate)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Gerar PDF
                </Button>
                <Button 
                  onClick={() => handleSendCertificate(selectedCertificate)}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Enviar por Email
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle>Configurações de Certificados</DialogTitle>
            <DialogDescription>
              Personalize os modelos de certificados emitidos pelo sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium">Modelo Padrão</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Título do Certificado</label>
              <Input 
                defaultValue="Certificado de Conclusão"
                placeholder="Ex: Certificado de Conclusão de Curso"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Texto Antes do Nome</label>
                <Input 
                  defaultValue="Certificamos que"
                  placeholder="Texto que aparece antes do nome do aluno"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Texto Antes do Curso</label>
                <Input 
                  defaultValue="concluiu com êxito o curso"
                  placeholder="Texto que aparece antes do nome do curso"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Texto do Rodapé</label>
              <Input 
                defaultValue="Certificado válido como comprovante de conclusão"
                placeholder="Texto adicional no rodapé do certificado"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Assinatura Digital (URL da imagem)</label>
              <Input 
                defaultValue=""
                placeholder="URL da imagem de assinatura"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplateSettings}>
              Salvar Configurações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
