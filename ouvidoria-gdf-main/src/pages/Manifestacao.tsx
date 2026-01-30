import Layout from "@/components/Layout";
import { ManifestacaoWizard } from "@/components/manifestacao/wizard/ManifestacaoWizard";
import { Step1Relato } from "@/components/manifestacao/wizard/steps/Step1Relato";
import { Step2Assunto } from "@/components/manifestacao/wizard/steps/Step2Assunto";
import { Step3InfoComplementares } from "@/components/manifestacao/wizard/steps/Step3InfoComplementares";
import { Step4Resumo } from "@/components/manifestacao/wizard/steps/Step4Resumo";
import { Step5Identificacao } from "@/components/manifestacao/wizard/steps/Step5Identificacao";
import { Step6Anexos } from "@/components/manifestacao/wizard/steps/Step6Anexos";
import { Step7Protocolo } from "@/components/manifestacao/wizard/steps/Step7Protocolo";
import { useManifestacaoForm } from "@/hooks/useManifestacaoForm";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const Manifestacao = () => {
  const {
    formState,
    updateField,
    toggleCategory,
    errors,
    validateStep,
    isSubmitting,
    isSubmitted,
    submitResult,
    submit,
    saveCurrentDraft,
  } = useManifestacaoForm();

  const handleComplete = () => {
    submit();
  };

  return (
    <Layout>
      <ManifestacaoWizard
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
        isSubmitted={isSubmitted}
        validateStep={validateStep}
      >
        {({ currentStep, goToStep }) => {
          // Hide save draft button on last step if already submitted
          const showSaveDraft = currentStep < 7 || !isSubmitted;

          return (
            <>
              {/* Save Draft Button */}
              {showSaveDraft && currentStep < 7 && (
                <div className="flex justify-end mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveCurrentDraft}
                    className="gap-2"
                    aria-label="Salvar rascunho"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Salvar Rascunho
                  </Button>
                </div>
              )}

              {/* Step Content */}
              {currentStep === 1 && (
                <Step1Relato
                  tipo={formState.tipo}
                  onTipoChange={(tipo) => updateField("tipo", tipo)}
                  conteudo={formState.conteudo}
                  onConteudoChange={(value) => updateField("conteudo", value)}
                  audioBlob={formState.audioBlob}
                  onAudioChange={(blob) => updateField("audioBlob", blob)}
                  imageFile={formState.imageFile}
                  onImageChange={(file) => updateField("imageFile", file)}
                  videoFile={formState.videoFile}
                  onVideoChange={(file) => updateField("videoFile", file)}
                  selectedCategories={formState.selectedCategories}
                  onCategoryToggle={toggleCategory}
                  errors={errors}
                />
              )}

              {currentStep === 2 && (
                <Step2Assunto
                  categoriaTipo={formState.categoriaTipo}
                  onCategoriaTipoChange={(value) => updateField("categoriaTipo", value)}
                  orgaoId={formState.orgaoId}
                  onOrgaoChange={(id, nome) => {
                    updateField("orgaoId", id);
                    updateField("orgaoNome", nome || "");
                  }}
                  errors={errors}
                />
              )}

              {currentStep === 3 && (
                <Step3InfoComplementares
                  localOcorrencia={formState.localOcorrencia}
                  onLocalChange={(value) => updateField("localOcorrencia", value)}
                  dataOcorrencia={formState.dataOcorrencia}
                  onDataChange={(value) => updateField("dataOcorrencia", value)}
                  envolvidos={formState.envolvidos}
                  onEnvolvidosChange={(value) => updateField("envolvidos", value)}
                  testemunhas={formState.testemunhas}
                  onTestemunhasChange={(value) => updateField("testemunhas", value)}
                  sigiloDados={formState.sigiloDados}
                  onSigiloChange={(value) => updateField("sigiloDados", value)}
                />
              )}

              {currentStep === 4 && (
                <Step4Resumo
                  tipo={formState.tipo}
                  conteudo={formState.conteudo}
                  audioBlob={formState.audioBlob}
                  imageFile={formState.imageFile}
                  videoFile={formState.videoFile}
                  selectedCategories={formState.selectedCategories}
                  categoriaTipo={formState.categoriaTipo}
                  orgaoId={formState.orgaoId}
                  orgaoNome={formState.orgaoNome}
                  localOcorrencia={formState.localOcorrencia}
                  dataOcorrencia={formState.dataOcorrencia}
                  envolvidos={formState.envolvidos}
                  testemunhas={formState.testemunhas}
                  sigiloDados={formState.sigiloDados}
                  onEditStep={goToStep}
                />
              )}

              {currentStep === 5 && (
                <Step5Identificacao
                  isAnonymous={formState.isAnonymous}
                  onAnonymousChange={(value) => updateField("isAnonymous", value)}
                  nome={formState.nome}
                  onNomeChange={(value) => updateField("nome", value)}
                  email={formState.email}
                  onEmailChange={(value) => updateField("email", value)}
                  aceiteLGPD={formState.aceiteLGPD}
                  onAceiteLGPDChange={(value) => updateField("aceiteLGPD", value)}
                  errors={errors}
                />
              )}

              {currentStep === 6 && (
                <Step6Anexos
                  anexos={formState.anexos}
                  onAnexosChange={(files) => updateField("anexos", files)}
                />
              )}

              {currentStep === 7 && (
                <Step7Protocolo
                  protocolo={submitResult?.protocolo || null}
                  senha={submitResult?.senha || null}
                  isSubmitting={isSubmitting}
                  onSubmit={submit}
                  isSubmitted={isSubmitted}
                />
              )}
            </>
          );
        }}
      </ManifestacaoWizard>
    </Layout>
  );
};

export default Manifestacao;
