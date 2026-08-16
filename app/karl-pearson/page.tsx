'use client';

import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function KarlPearsonPage() {
  const [n, setN] = useState<string>('5');
  const [xVal, setXVal] = useState<string>('10, 20, 30, 40, 50');
  const [yVal, setYVal] = useState<string>('15, 25, 35, 45, 55');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateCorrelation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const count = parseInt(n.trim(), 10);
      if (isNaN(count) || count <= 0) {
        throw new Error('Number of observations (n) must be a positive integer.');
      }

      const xArr = xVal.split(',').map((item) => parseFloat(item.trim())).filter((v) => !isNaN(v));
      const yArr = yVal.split(',').map((item) => parseFloat(item.trim())).filter((v) => !isNaN(v));

      if (xArr.length !== count || yArr.length !== count) {
        throw new Error(`Expected ${count} numeric values for X and Y, but got ${xArr.length} for X and ${yArr.length} for Y.`);
      }

      const xSum = xArr.reduce((a, b) => a + b, 0);
      const ySum = yArr.reduce((a, b) => a + b, 0);
      const xySum = xArr.reduce((sum, x, i) => sum + x * yArr[i], 0);
      const xSqSum = xArr.reduce((sum, x) => sum + x * x, 0);
      const ySqSum = yArr.reduce((sum, y) => sum + y * y, 0);

      const numerator = count * xySum - xSum * ySum;
      const denomTerm1 = count * xSqSum - xSum * xSum;
      const denomTerm2 = count * ySqSum - ySum * ySum;

      if (denomTerm1 < 0 || denomTerm2 < 0) {
        throw new Error('Invalid mathematical state resulting in negative value under square root.');
      }

      const denominator = Math.sqrt(denomTerm1 * denomTerm2);

      if (denominator === 0) {
        throw new Error('Denominator is zero. Variance is zero for one or both variables, correlation cannot be calculated.');
      }

      const r = numerator / denominator;
      setResult(r);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Karl Pearson&apos;s <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Calculator</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          Calculate Karl Pearson&apos;s Coefficient of Correlation (r) between two sets of numeric variables from scratch.
        </p>
      </header>

      <div className="cyber-glass-card p-6 md:p-8 max-w-xl mx-auto">
        <form onSubmit={calculateCorrelation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5" htmlFor="n">
              Number of Observations (n):
            </label>
            <input
              type="number"
              id="n"
              className="cyber-input"
              placeholder="e.g. 5"
              value={n}
              onChange={(e) => setN(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5" htmlFor="x">
              Comma-separated Values for Variable X:
            </label>
            <input
              type="text"
              id="x"
              className="cyber-input"
              placeholder="e.g. 10, 20, 30, 40, 50"
              value={xVal}
              onChange={(e) => setXVal(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5" htmlFor="y">
              Comma-separated Values for Variable Y:
            </label>
            <input
              type="text"
              id="y"
              className="cyber-input"
              placeholder="e.g. 15, 25, 35, 45, 55"
              value={yVal}
              onChange={(e) => setYVal(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="cyber-btn-primary w-full py-3 text-sm mt-6">
            <Calculator size={16} /> Calculate Correlation
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 flex items-start gap-3 text-xs leading-relaxed shadow-sm">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Error:</strong> {error}
            </div>
          </div>
        )}

        {result !== null && (
          <div className="mt-6 p-6 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-center flex flex-col items-center justify-center shadow-inner">
            <div className="flex items-center gap-1.5 text-cyber-cyan mb-2">
              <CheckCircle2 size={20} className="animate-pulse" />
              <h3 className="text-sm font-bold tracking-wide">Calculation Complete</h3>
            </div>
            <p className="text-[0.78rem] text-text-secondaryLight dark:text-text-secondaryDark mb-1">
              Correlation Coefficient (r):
            </p>
            <div className="text-4xl font-extrabold font-code text-text-primaryLight dark:text-text-primaryDark tracking-wider my-2">
              {result.toFixed(6)}
            </div>
            <p className="text-[0.72rem] font-bold text-text-muted mt-1 uppercase tracking-wider">
              {result > 0.7
                ? 'Strong Positive Linear Correlation'
                : result < -0.7
                ? 'Strong Negative Linear Correlation'
                : result === 0
                ? 'No Linear Correlation'
                : 'Moderate/Weak Correlation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
