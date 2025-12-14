import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { ArrowLeft } from 'lucide-react';

const CONTENT: Record<string, { title: string; body: string }> = {
    'terms': {
        title: 'Terms of Service',
        body: 'Welcome to Pookie. By accessing or using our platform, you agree to be bound by these terms. Betting involves risk. Please gamble responsibly.'
    },
    'privacy': {
        title: 'Privacy Policy',
        body: 'We value your privacy. We do not collect personal data beyond your public wallet address and necessary transaction details.'
    },
    'docs': {
        title: 'Documentation',
        body: 'Pookie is a cross-chain prediction market protocol. \n\n### How it works\n1. Connect Wallet\n2. Choose a Market\n3. Place a Bet (YES/NO)\n4. Wait for resolution\n5. Claim winnings'
    },
    'api': {
        title: 'API Reference',
        body: 'Our API is currently in private beta. Please contact us on Discord for access keys.'
    }
};

export const StaticPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const content = CONTENT[slug || 'terms'] || CONTENT['terms'];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Link to="/">
                <Button variant="ghost" size="sm" className="pl-0">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>
            </Link>
            
            <Card className="p-8 min-h-[50vh]">
                <h1 className="text-3xl font-bold text-white mb-6 border-b border-border pb-4">{content.title}</h1>
                <div className="text-zinc-400 whitespace-pre-line leading-relaxed">
                    {content.body}
                </div>
            </Card>
        </div>
    );
};