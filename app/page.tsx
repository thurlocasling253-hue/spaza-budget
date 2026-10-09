'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, RefreshCw, ShieldAlert, Sparkles, TrendingUp, Users, Wallet, X } from 'lucide-react';

interface BudgetState {
  income: number;
  period: 'weekly' | 'monthly';
  householdSize: number;
  housing: number;
  debt: number;
  completedOnboarding: boolean;
}

const DEFAULT_BUDGET: BudgetState = {
  income: 3500,
  period: 'monthly',
  householdSize: 3,
  housing: 1200,
  debt: 300,
  completedOnboarding: false,
};

export default function Page() {
  const [budget, setBudget] = useState<BudgetState>(DEFAULT_BUDGET);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: 'Sho! I am your Spaza AI advisor. How can I help you adjust your survival budget today?' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('spaza_budget_state');
    if (saved) {
      try {
        setBudget(JSON.parse(saved));
      } catch {
        console.error('Invalid saved budget state');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spaza_budget_state', JSON.stringify(budget));
    }
  }, [budget, isLoaded]);

  const foodAllocation = (budget.period === 'weekly' ? 250 : 1000) * budget.householdSize;
  const fixedExpenses = budget.housing + budget.debt;
  const totalSurvivalNeed = foodAllocation + fixedExpenses;
  const remainingCash = Math.max(0, budget.income - totalSurvivalNeed);
  const discretionaryCap = remainingCash * 0.15;

  const handleOnboardingComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget((prev) => ({ ...prev, completedOnboarding: true }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Based on your balance of R${budget.income}, this leaves about R${remainingCash.toFixed(0)} after your core survival costs. Try to cap non-essential spend under R${discretionaryCap.toFixed(0)}.`,
        },
      ]);
    }, 400);
  };

  if (!isLoaded) return null;

  if (!budget.completedOnboarding) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Welcome to SpazaBudget
            </span>
            <h1 className="text-2xl font-bold text-white">Let’s Set Up Your Baseline</h1>
            <p className="text-xs text-slate-400">Enter honest household numbers to generate your customized plan.</p>
          </div>

          <form onSubmit={handleOnboardingComplete} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Income / Balance (ZAR)</label>
              <input
                type="number"
                required
                value={budget.income || ''}
                onChange={(e) => setBudget({ ...budget, income: Number(e.target.value) })}
                placeholder="e.g. 3500"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Period</label>
                <select
                  value={budget.period}
                  onChange={(e) => setBudget({ ...budget, period: e.target.value as 'weekly' | 'monthly' })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Household Size</label>
                <input
                  type="number"
                  min="1"
                  value={budget.householdSize}
                  onChange={(e) => setBudget({ ...budget, householdSize: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Housing & Utilities (ZAR)</label>
              <input
                type="number"
                value={budget.housing || ''}
                onChange={(e) => setBudget({ ...budget, housing: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 transition-all"
            >
              Generate Triage Plan <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">SB</div>
            <span className="font-bold text-white tracking-wide">SpazaBudget</span>
          </div>

          <button
            onClick={() => setBudget((prev) => ({ ...prev, completedOnboarding: false }))}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-enter Data
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Available</span>
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">R {budget.income.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Configured {budget.period}</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Survival Need</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">R {totalSurvivalNeed.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Food, Housing & Debt minimums</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Safely Available</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">R {remainingCash.toLocaleString()}</div>
            <p className="text-xs text-slate-500">After core survival expenses</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 space-y-2 backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Household</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{budget.householdSize} People</div>
            <p className="text-xs text-slate-500">R {foodAllocation} basic food basket</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Recommended Triage Sequence
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">1. Staple Food Allocation</div>
                <div className="text-xs text-slate-400">Maize meal, cooking oil, protein basics</div>
              </div>
              <span className="font-bold text-emerald-400">R {foodAllocation}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">2. Housing & Fixed Utilities</div>
                <div className="text-xs text-slate-400">Rent, shelter, basic light/water minimums</div>
              </div>
              <span className="font-bold text-slate-200">R {budget.housing}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="font-semibold text-white">3. Discretionary Spending Cap</div>
                <div className="text-xs text-slate-400">Max safe limit for non-essentials</div>
              </div>
              <span className="font-bold text-amber-400">R {discretionaryCap.toFixed(0)}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 transition-all scale-100 hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Spaza AI Advisor</span>
          </button>
        ) : (
          <div className="w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col h-[480px] overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-sm text-white">Spaza AI Triage Advisor</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto bg-emerald-600 text-white' : 'bg-slate-950 text-slate-200 border border-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask advice on groceries, transport..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-500 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
