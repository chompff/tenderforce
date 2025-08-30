# EED Tool Application Flow Diagram

## Main Application Flow

```mermaid
graph TD
    Start([User Enters Application]) --> Mode{Stealth Mode?}
    
    Mode -->|Yes| StealthFlow[EED Check Only]
    Mode -->|No| FullFlow[Full Tool Suite]
    
    %% Full Application Flow
    FullFlow --> SelectTool{Select Tool}
    SelectTool --> EEDTool[EED Assessment]
    SelectTool --> ProcurementCheck[Aanbestedingsplicht Check]
    SelectTool --> SectorCheck[Sectorale Verplichtingen]
    SelectTool --> MaterialChange[Wezenlijke Wijziging]
    SelectTool --> OtherTools[Other Tools]
    
    %% Stealth Mode Flow
    StealthFlow --> EEDDirect[Direct EED Assessment]
    
    %% EED Assessment Flow
    EEDTool --> CPVInput[Enter CPV Code]
    EEDDirect --> CPVInput
    CPVInput --> CPVLookup[Lookup CPV Description]
    CPVLookup --> OrgType{Organization Type?}
    
    OrgType -->|Government| GovFlow[Government Path]
    OrgType -->|Other| NonGovFlow[Non-Government Path]
    
    %% Government Flow
    GovFlow --> WrittenAgreement{Written Agreement?}
    WrittenAgreement -->|No| NoDuty[No Procurement Duty]
    WrittenAgreement -->|Yes| CounterPerformance{Counter Performance?}
    
    %% Non-Government Flow
    NonGovFlow --> TenderingOrg{Tendering Organization?}
    TenderingOrg -->|No| Subsidy{More than 50% Subsidized?}
    TenderingOrg -->|Yes| WrittenAgreement
    Subsidy -->|No| NoDuty
    Subsidy -->|Yes| WrittenAgreement
    
    %% Contract Assessment Flow
    CounterPerformance -->|No| NoDuty
    CounterPerformance -->|Money| LegallyEnforceable{Legally Enforceable?}
    CounterPerformance -->|Other| LegallyEnforceable
    
    LegallyEnforceable -->|No| NoDuty
    LegallyEnforceable -->|Yes| EconInterest{Economic Interest?}
    
    EconInterest -->|No| NoDuty
    EconInterest -->|Yes| ThresholdCheck{Above Threshold?}
    
    %% Threshold Decision Flow
    ThresholdCheck -->|Calculate| Calculator[Threshold Calculator]
    Calculator --> ThresholdCheck
    ThresholdCheck -->|Yes > €140k-€5.5M| Exception{Exception Applies?}
    ThresholdCheck -->|No| CrossBorder{Cross-Border Interest?}
    
    Exception -->|Yes| NoDuty
    Exception -->|No| EUDuty[EU Procurement Rules Apply]
    
    CrossBorder -->|Not Likely| NatRules[National Rules Apply]
    CrossBorder -->|Likely| Transparency[Transparency Rules Apply]
    
    %% Results Flow
    EUDuty --> Results[Generate Results]
    Transparency --> Results
    NatRules --> Results
    NoDuty --> Results
    
    Results --> EEDCompliance{Check EED Compliance}
    EEDCompliance --> GPPCriteria{Check GPP Criteria}
    GPPCriteria --> FinalReport[Final Assessment Report]
    
    %% Report Actions
    FinalReport --> Actions{User Actions}
    Actions --> SavePDF[Download PDF]
    Actions --> ShareLink[Share Link]
    Actions --> NewAssessment[New Assessment]
    
    NewAssessment --> Start
```

## Threshold Values by Organization Type

```mermaid
graph LR
    subgraph "Central Government"
        CG1[Services: €140,000]
        CG2[Supplies: €140,000]
        CG3[Works: €5,538,000]
    end
    
    subgraph "Decentral Authorities"
        DA1[Services: €221,000]
        DA2[Supplies: €221,000]
        DA3[Works: €5,538,000]
    end
    
    subgraph "Special Sector Companies"
        SS1[Services: €443,000]
        SS2[Supplies: €443,000]
        SS3[Works: €5,538,000]
    end
    
    subgraph "Subsidized Entities"
        SE1[Services: €221,000]
        SE2[Supplies: €5,538,000]
    end
```

## Decision Logic Flow

```mermaid
graph TD
    subgraph "Key Decision Points"
        D1[Organization Type] --> D2[Contract Characteristics]
        D2 --> D3[Threshold Evaluation]
        D3 --> D4[Compliance Requirements]
    end
    
    subgraph "Contract Characteristics"
        C1[Written Agreement]
        C2[Counter Performance]
        C3[Legal Enforceability]
        C4[Economic Interest]
    end
    
    subgraph "Compliance Outcomes"
        O1[No Procurement Duty]
        O2[National Rules]
        O3[Transparency Rules]
        O4[EU Procurement Rules]
        O5[EED Requirements]
        O6[GPP Criteria]
    end
    
    D2 --> C1 & C2 & C3 & C4
    C1 & C2 & C3 & C4 --> D3
    D4 --> O1 | O2 | O3 | O4
    O4 --> O5 & O6
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> AskOrgType
    
    AskOrgType --> AskTenderingOrgType: Other Organization
    AskOrgType --> AskWrittenAgreement: Government
    
    AskTenderingOrgType --> AskWrittenAgreement: Yes
    AskTenderingOrgType --> AskSubsidy: No
    
    AskSubsidy --> AskWrittenAgreement: Yes (>50%)
    AskSubsidy --> ResultNoDuty: No
    
    AskWrittenAgreement --> AskCounterPerformance: Yes
    AskWrittenAgreement --> ResultNoDuty: No
    
    AskCounterPerformance --> AskLegallyEnforceable: Yes
    AskCounterPerformance --> ResultNoDuty: No
    
    AskLegallyEnforceable --> AskEconInterest: Yes
    AskLegallyEnforceable --> ResultNoDuty: No
    
    AskEconInterest --> AskThreshold: Yes
    AskEconInterest --> ResultNoDuty: No
    
    AskThreshold --> AskException: Above Threshold
    AskThreshold --> AskCrossBorderInterest: Below Threshold
    
    AskException --> ResultDuty: No Exception
    AskException --> ResultNoDuty: Exception Applies
    
    AskCrossBorderInterest --> ResultTransparency: Likely
    AskCrossBorderInterest --> ResultNatRules: Not Likely
    
    ResultNoDuty --> [*]
    ResultNatRules --> [*]
    ResultTransparency --> [*]
    ResultDuty --> [*]
```

## Data Flow

```mermaid
graph LR
    subgraph "Input Sources"
        User[User Input]
        CPVData[CPV Database]
        URLState[URL Parameters]
    end
    
    subgraph "Processing"
        Validation[Form Validation]
        BusinessRules[Business Rules Engine]
        ThresholdCalc[Threshold Calculator]
    end
    
    subgraph "Output"
        Results[Assessment Results]
        PDF[PDF Report]
        ShareableLink[Shareable Link]
    end
    
    User --> Validation
    CPVData --> Validation
    URLState --> Validation
    
    Validation --> BusinessRules
    BusinessRules --> ThresholdCalc
    ThresholdCalc --> BusinessRules
    
    BusinessRules --> Results
    Results --> PDF
    Results --> ShareableLink
```

## Key Features

1. **Stealth Mode**: Simplified interface for EED assessment only
2. **Progressive Disclosure**: Questions revealed based on previous answers
3. **State Persistence**: URL parameters maintain assessment state
4. **Legal Citations**: Hover tooltips with EU directive references
5. **Threshold Calculator**: External tool for complex calculations
6. **Multi-language**: Support for Dutch terminology
7. **Responsive Design**: Works on desktop and mobile devices