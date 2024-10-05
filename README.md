
### Overview

LancePoint is a revolutionary platform designed to streamline on-chain payments and empower workers with greater control over their reputation. Traditional freelancing platforms often lack transparency and put both clients and workers at risk of fraud or dishonest behavior. Our platform leverages blockchain technology to address these issues and provide a secure, transparent, and efficient environment for freelancers and clients to engage in business transactions.

#### Key Features

- **On-chain Payments**: Utilize smart contracts to facilitate secure and transparent transactions between clients and workers, eliminating the need for intermediaries and reducing the risk of fraud.

- **Anonymity and Privacy**: Protect user privacy by enabling anonymous interactions between clients and workers while still ensuring transparency and accountability through on-chain ratings and reputation management.

- **Worker Reputation Control**: Empower workers to take control of their reputation by providing them with the ability to build and maintain their on-chain reputation, which can be accessed and verified by potential clients.

- **Deposit and Withdrawal Functionality**: Enable users to deposit funds into the platform using supported cryptocurrencies and withdraw funds securely through smart contracts.

- **Job Posting and Selection**: Allow clients to post job openings on the platform and review CVs submitted by interested workers. Clients can then select the most suitable worker for the job based on their qualifications and experience.

- **Agreement and Assignment**: Facilitate agreement between clients and workers on job terms through cryptographic signatures, and automate the assignment of jobs to selected workers through smart contracts.

- **Dispute Resolution**: Implement a fair and transparent dispute resolution mechanism that enables the platform to intervene and resolve disputes between clients and workers in cases of dishonest behavior or breach of contract.

#### Mission Statement

Our mission is to revolutionize the freelance industry by providing a decentralized platform that prioritizes security, transparency, and fairness for all parties involved. We believe that by harnessing the power of blockchain technology, we can create a more equitable and efficient marketplace where freelancers can thrive and clients can find reliable, high-quality services with confidence.

#### Vision

We envision a future where freelancers have full control over their reputation and earnings, where transactions are secure and transparent, and where trust is built on a foundation of integrity and accountability. By pioneering innovative solutions and embracing the principles of decentralization, we aim to redefine the way freelancers and clients interact, empowering individuals to achieve their full potential in the digital economy.

#### Target Audience

Our platform is designed for freelancers and clients across various industries who are seeking a secure, transparent, and efficient way to engage in business transactions. Whether you're a freelance developer, designer, writer, or consultant, or a client in need of professional services, [Your Application Name] provides the tools and infrastructure you need to succeed in the digital marketplace.


Certainly! Here's a suggested control flow for your application, broken down into steps:

### Control Flow

#### 1. Account Creation and Fund Deposit

1. **User Registration**: 
    - Users create an account on the platform by providing necessary information such as username, and password.
    - Users will also connect their wallet, in order to maintain consistency on chain the application will function on an account to wallet basis ie one address to an account 
    - data containing the users personal information eg (bvn, bank details) is not required 

2. **Fund Deposit**:
3.  - This is a feature meant for clients 
    - Users deposit funds into their platform account by sending supported cryptocurrencies to their unique deposit address provided by the platform.
    - Funds are securely stored in the platform's smart contract.
    - Funds can be withdrawn at any time as long as they are not currently being assigned to a contract, this is done to ensure the client does not remove the funds meant to pay the workers mid work 
    - Users who frequently request jobs can make large deposits at a time to reduce the gas cost, this funds can them be allocated to different jobs as long the funds can cover said jobs 

#### 2. Job Posting and Worker Selection

3. **Job Posting**:
    - Clients post job openings on the platform, specifying job details such as title, description, skills required, and budget.

4. **Worker Application**:
    - Workers review available job openings and submit their CVs or proposals for consideration.

5. **Worker Selection**:
    - Clients review received applications and select the most suitable worker for the job based on qualifications, experience, and proposed terms.
    - All communication between the client and the worker must be done  through the platform to ensure transparency especially in a case of dispute, information not on the platform might be hard to verify

#### 3. Agreement and Job Assignment

6. **Terms Agreement**:
    - Both client and selected worker agree to the job terms by signing a message with their private keys, ensuring cryptographic integrity.
    - said message will contain information such as duration , payment amount, client address , workers address, nance etc

7. **Job Assignment**:
    - The client initiates the assignment of the job to the selected worker by submitting the agreed-upon terms and signatures to the platform's smart contract.

#### 4. Job Completion and Payment

8. **Job Completion**:
    - Upon completion of the job, the worker notifies the client.

9. **Client Review and Rating**:
    - The client reviews the completed work and rates the worker based on their performance and satisfaction.

10. **Worker Payment Authorization**:
    - If satisfied, the client authorizes the payment to the worker by signing a message with their private key.
    - said message will contain data such as {rating, a review string, tip}

11. **Payment Execution**:
    - The client initiates the payment by submitting the payment authorization message to the platform's smart contract.
    - The smart contract verifies the authorization and releases the funds to the worker's account after taking out a small fee for the protocol.

#### 5. Dispute Resolution

12. **Dispute Initiation**:
    - In case of disagreement or dispute between client and worker, either party can initiate a dispute resolution process.

13. **Protocol Investigation**:
    - The platform's protocol team investigates the dispute, gathering relevant evidence and information from both parties.

14. **Resolution Decision**:
    - Based on the investigation, the protocol team determines the resolution of the dispute and issues appropriate instructions to the smart contract for fund allocation.

#### 6. Off-Platform Transactions (Optional)

15. **Off-Platform Interaction**:
    - If client and worker interact outside the platform for a job, similar steps of agreement, completion, and payment can be followed.

16. **Dispute Handling (Off-Platform)**:
    - In case of disputes arising from off-platform transactions, the protocol team may provide guidance or mediation but may face limitations in intervention.

This control flow provides a structured sequence of actions for users to follow when using your platform, ensuring clarity and consistency in the process.

**DEV**

**Designer** The layout of the app is like that of a freelance platform  with a focus on designing web3 designs, another difference would be the design of a connect web3 option(there are several examples online)



**WEB2 DEVELOPER**
frontend 
classic features of a freelance website 
integrate web3 ie users should be able to connect their wallets to signup and sign messages 
users should be able to communicate with each other in a secure way 
users should be able to input job value on assignment and a message should be crafted which fits what is expected by the smart contract, said messsage will then be signed 
recommendation : read on web3.js

backend 
store user data in secure database ie (username,password,wallet address and data related to the users public image eg their stack,exp and reviews for freelancers and total completed jobs for clients)
cache of user data on login etc 

**BLOCKCHAIN DEVELOPER**
implementation of all smart contracts (for the purpose of the project, the smart contract language is solidity)
notable features include 
a deposit functionality : for clients to deposit 
a withdraw functionality : for cliets to withdraw funds not allocated to any job
a assign job functionality : for clients to assign a job to a freelancer 
a finish job functionality : for freelancers to receive the reward for completing a job 

INVARIANTS 
clients must not be able to withdraw funds assigned to a job 
workers must not be able to give themselves job which the client didnt sign 



