"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import { UploadStepper } from "./upload-stepper"
import { IPFSUploadCard } from "./ipfs-upload-card"
import { MetadataCard } from "./metadata-card"
import { NFTMintCard } from "./nft-mint-card"
import { StoryRegisterCard } from "./story-register-card"
import { LicenseConfigCard } from "./license-config-card"
import { CompleteCard } from "./complete-card"

interface BlockchainWizardProps {
  datasetId: number
  file: File
  datasetInfo: {
    title: string
    description: string
    category: string
  }
  onClose: () => void
}

export function BlockchainWizard({ datasetId, file, datasetInfo, onClose }: BlockchainWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [blockchainData, setBlockchainData] = useState<{
    ipfsCid?: string
    metadataCid?: string
    metadata?: any
    nftData?: { contractAddress: string; tokenId: string; txHash: string } | null
    ipId?: string
    licenseTermsId?: string
    licenseConfig?: any
  }>({})

  const handleIPFSComplete = (cid: string) => {
    setBlockchainData({ ...blockchainData, ipfsCid: cid })
    setCurrentStep(2)
  }

  const handleMetadataComplete = (cid: string, metadata: any) => {
    setBlockchainData({ ...blockchainData, metadataCid: cid, metadata })
    setCurrentStep(3)
  }

  const handleNFTComplete = (nftData: { contractAddress: string; tokenId: string; txHash: string } | null) => {
    setBlockchainData({ ...blockchainData, nftData })
    setCurrentStep(4)
  }

  const handleIPComplete = (ipId: string) => {
    setBlockchainData({ ...blockchainData, ipId })
    setCurrentStep(5)
  }

  const handleLicenseComplete = async (licenseTermsId: string, config: any) => {
    const finalData = { ...blockchainData, licenseTermsId, licenseConfig: config }
    setBlockchainData(finalData)

    // Persist all data to database
    try {
      await fetch("/api/datasets/finalize", {
        method: "POST",
        body: JSON.stringify({
          datasetId,
          ...finalData,
          royaltyPercentage: blockchainData.metadata?.royaltyPercentage || 5,
          isNft: !!finalData.nftData,
        }),
        headers: { "Content-Type": "application/json" },
      })
    } catch (error) {
      console.error("[v0] Failed to finalize dataset:", error)
    }

    setCurrentStep(6)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkipBlockchain = () => {
    if (
      confirm(
        "Are you sure you want to skip the blockchain registration? Your dataset will still be visible but won't have NFT/IP protection.",
      )
    ) {
      onClose()
    }
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Blockchain Registration</h2>
          <p className="text-gray-400">Secure your dataset with NFT and IP protection</p>
        </div>
        <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <UploadStepper currentStep={currentStep} />

      <div className="max-w-2xl mx-auto">
        {currentStep === 1 && <IPFSUploadCard file={file} onComplete={handleIPFSComplete} />}

        {currentStep === 2 && blockchainData.ipfsCid && (
          <MetadataCard
            initialData={datasetInfo}
            fileCid={blockchainData.ipfsCid}
            onComplete={handleMetadataComplete}
          />
        )}

        {currentStep === 3 && blockchainData.metadataCid && (
          <NFTMintCard metadataCid={blockchainData.metadataCid} onComplete={handleNFTComplete} />
        )}

        {currentStep === 4 && (
          <StoryRegisterCard nftData={blockchainData.nftData || null} onComplete={handleIPComplete} />
        )}

        {currentStep === 5 && (
          <LicenseConfigCard ipId={blockchainData.ipId || null} onComplete={handleLicenseComplete} />
        )}

        {currentStep === 6 && <CompleteCard datasetId={datasetId} blockchainData={blockchainData} />}

        {currentStep < 6 && (
          <div className="flex gap-2 mt-6">
            {currentStep > 1 && (
              <Button onClick={handleBack} variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button onClick={handleSkipBlockchain} variant="ghost" className="ml-auto text-gray-400 hover:text-white">
              Skip Blockchain Registration
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
