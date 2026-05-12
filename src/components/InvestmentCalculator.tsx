import { useState } from "react";
import { cn } from "../lib/utils";

export default function InvestmentCalculator() {
  const [calculatorInputs, setCalculatorInputs] = useState({
    investmentAmount: "450000000",
    years: "5",
  });

  const estimatedReturn = () => {
    const principal = parseInt(calculatorInputs.investmentAmount) || 0;
    const years = parseInt(calculatorInputs.years) || 5;
    const returnRate = 0.18;
    const total = principal * Math.pow(1 + returnRate, years);
    return total.toLocaleString("en-US");
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('en-US');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCalculatorInputs((prev) => ({ ...prev, investmentAmount: raw }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-earth-700 mb-2">
          Investment Amount (UGX)
        </label>
        <input
          type="text"
          value={formatNumber(calculatorInputs.investmentAmount)}
          onChange={handleAmountChange}
          className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter amount"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-earth-700 mb-2">
          Investment Period (Years)
        </label>
        <select
          value={calculatorInputs.years}
          onChange={(e) => setCalculatorInputs((prev) => ({ ...prev, years: e.target.value }))}
          className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="1">1 Year</option>
          <option value="3">3 Years</option>
          <option value="5">5 Years</option>
          <option value="10">10 Years</option>
        </select>
      </div>

      <div className="mt-8 p-6 bg-sage-50 rounded-xl border border-sage-200">
        <p className="text-sm text-earth-500 mb-2">Estimated Value After {calculatorInputs.years} Years</p>
        <p className="text-4xl font-bold text-primary">UGX {estimatedReturn()}</p>
        <p className="text-sm text-sage-600 mt-2">
          +{(parseInt(calculatorInputs.investmentAmount || '0') * 0.18 * parseInt(calculatorInputs.years || '0')).toLocaleString("en-US")} gain
        </p>
      </div>
    </div>
  );
}
