import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Settings, 
  TrendingUp, 
  Wrench, 
  Users, 
  Clock, 
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info,
  MapPin,
  Zap,
  BarChart3,
  PieChart,
  FileText,
  AlertTriangle,
  ChevronRight,
  Target,
  Activity,
  Download,
  History,
  CheckCircle2,
  Clock3,
  Search,
  Filter,
  Leaf,
  Layers,
  Award,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

const PEAsePro = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('calc');
  const [jobType, setJobType] = useState('preventive');
  const [manpowerCount, setManpowerCount] = useState(4);
  const [hours, setHours] = useState(6);
  const [equipmentTier, setEquipmentTier] = useState('standard'); 
  const [distance, setDistance] = useState(45);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // --- Audit Log & UI States ---
  const [selectedLog, setSelectedLog] = useState(null);
  const [exportDropdown, setExportDropdown] = useState({ engine: false, audit: false });

  // --- Configuration ---
  const CONFIG = {
    HOURLY_RATE: 550,
    OVERHEAD: 0.18,
    MARGIN: 0.12,
    EQUIPMENT: {
      standard: { value: 450000, risk: 1.0, label: 'Standard Tools' },
      'high-precision': { value: 1200000, risk: 1.2, label: 'Precision Gear' },
      heavy: { value: 3500000, risk: 1.4, label: 'Heavy Machinery' }
    }
  };

  // --- Mock Data for Audit Logs ---
  const auditLogsData = useMemo(() => [
    { 
      id: 'TX-9021', st: 'ST-BKK-001', val: 145000, sts: 'Verified', date: '2026-04-18', 
      details: { type: 'Preventive', staff: 4, hours: 8, efficiency: 92, distance: 45, equip: 'Standard Tools', laborCost: 17600, ohCost: 12500 }
    },
    { 
      id: 'TX-9020', st: 'ST-CNX-005', val: 289000, sts: 'Pending', date: '2026-04-19', 
      details: { type: 'Emergency', staff: 8, hours: 3, efficiency: 95, distance: 12, equip: 'Precision Gear', laborCost: 13200, ohCost: 45000 }
    },
    { 
      id: 'TX-9019', st: 'ST-PKT-012', val: 82500, sts: 'Verified', date: '2026-04-17', 
      details: { type: 'Corrective', staff: 3, hours: 5, efficiency: 88, distance: 80, equip: 'Heavy Machinery', laborCost: 8250, ohCost: 8000 }
    },
  ], []);

  // --- Engine Logic ---
  const calculateResult = (pCount, pHours, currentJobType = jobType) => {
    const equip = CONFIG.EQUIPMENT[equipmentTier];
    const labor = pCount * pHours * CONFIG.HOURLY_RATE;
    const depreciation = (equip.value / 8000) * pHours * equip.risk;
    const travel = distance * 15 * 2; 
    const base = labor + depreciation + travel + 1200; 
    
    const riskMultiplier = currentJobType === 'emergency' ? 1.6 : currentJobType === 'corrective' ? 1.3 : 1.1;
    const riskPremium = base * (riskMultiplier - 1);
    const overhead = (base + riskPremium) * CONFIG.OVERHEAD;
    const total = base + riskPremium + overhead;
    const finalPrice = total / (1 - CONFIG.MARGIN);

    // Dynamic AI Efficiency Logic based on Mission Priority
    let efficiencyScore = 100;
    let aiRule = "";
    let aiTarget = "";

    if (currentJobType === 'emergency') {
        const timePenalty = pHours > 4 ? 40 : 0; 
        const staffPenalty = pCount > 10 ? (pCount - 10) * 2 : 0; 
        efficiencyScore = Math.max(30, 95 - timePenalty - staffPenalty);
        aiRule = "Speed-Critical Resolution";
        aiTarget = "Target < 4 Hrs";
    } else if (currentJobType === 'corrective') {
        const timePenalty = pHours > 6 ? 15 : 0;
        const staffPenalty = pCount > 6 ? (pCount - 6) * 4 : 0;
        efficiencyScore = Math.max(30, 90 - timePenalty - staffPenalty);
        aiRule = "Balanced Recovery";
        aiTarget = "Optimal Staffing";
    } else {
        const timePenalty = pHours > 8 ? 10 : 0;
        const staffPenalty = pCount > 4 ? (pCount - 4) * 8 : 0; 
        efficiencyScore = Math.max(30, 100 - timePenalty - staffPenalty);
        aiRule = "Lean Resource Optimization";
        aiTarget = "Strict Planning";
    }

    const carbonFootprint = (distance * 0.21) + (pCount * 0.05) + (pHours * 0.12);

    return { 
      labor, depreciation, travel, base, riskPremium, overhead, total, finalPrice, 
      efficiencyScore, aiRule, aiTarget, margin: finalPrice - total, carbonFootprint 
    };
  };

  const current = calculateResult(manpowerCount, hours);
  const comparison = calculateResult(Math.ceil(manpowerCount * 0.5), hours * 1.8, 'preventive');

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1500);
  };

  // --- Dynamic Theming based on Job Type ---
  const getAiTheme = (type) => {
    switch(type) {
      case 'preventive': return {
        wrapper: "from-emerald-500/20 to-emerald-900/20 border-emerald-500/30",
        header: "text-emerald-400",
        popup: "bg-emerald-950/60 border-emerald-500/30",
        icon: "text-emerald-400",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/20"
      };
      case 'corrective': return {
        wrapper: "from-blue-500/20 to-blue-900/20 border-blue-500/30",
        header: "text-blue-400",
        popup: "bg-blue-950/60 border-blue-500/30",
        icon: "text-blue-400",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/20"
      };
      case 'emergency': return {
        wrapper: "from-red-500/20 to-red-900/20 border-red-500/30",
        header: "text-red-400",
        popup: "bg-red-950/60 border-red-500/30",
        icon: "text-red-400",
        badgeBg: "bg-red-500/10",
        badgeBorder: "border-red-500/20"
      };
      default: return {
        wrapper: "from-orange-500/20 to-orange-900/20 border-orange-500/30",
        header: "text-orange-400",
        popup: "bg-orange-950/60 border-orange-500/30",
        icon: "text-orange-400",
        badgeBg: "bg-orange-500/10",
        badgeBorder: "border-orange-500/20"
      };
    }
  };
  const aiTheme = getAiTheme(jobType);

  // --- Render Pricing Engine ---
  const renderPricingEngine = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      <section className="lg:col-span-4 space-y-6">
        <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-purple-400" />
              Job Parameters
            </h2>
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className={`p-2 rounded-lg transition-all ${showComparison ? 'bg-purple-500 text-white' : 'bg-slate-700 text-slate-400'}`}
              title="Toggle Comparison Mode"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wider">Mission Priority</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'preventive', label: 'Preventive (PM)', icon: ShieldCheck, color: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5' },
                  { id: 'corrective', label: 'Corrective (CM)', icon: Wrench, color: 'border-blue-500/50 text-blue-400 bg-blue-500/5' },
                  { id: 'emergency', label: 'Emergency (EM)', icon: AlertTriangle, color: 'border-red-500/50 text-red-400 bg-red-500/5' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setJobType(type.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      jobType === type.id ? type.color : 'border-slate-700 bg-slate-800/20 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <type.icon className="w-5 h-5" />
                      {type.label}
                    </div>
                    {jobType === type.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="group">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Staff Deployment
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={manpowerCount} 
                    onChange={(e) => setManpowerCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg font-black text-purple-400 focus:ring-2 ring-purple-500 outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-black uppercase">Pers.</div>
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Operational Hours
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.5"
                    value={hours} 
                    onChange={(e) => setHours(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg font-black text-purple-400 focus:ring-2 ring-purple-500 outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px] font-black uppercase">Hrs.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ESG Indicator */}
        <div className="bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Leaf className="w-4 h-4 text-emerald-400" />
             </div>
             <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sustainability Impact</span>
          </div>
          <div className="flex items-baseline gap-2">
             <span className="text-3xl font-black text-white">{current.carbonFootprint.toFixed(2)}</span>
             <span className="text-xs text-emerald-500 font-bold uppercase">kg CO2e</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">*Estimated carbon footprint based on logistics and team size</p>
        </div>
      </section>

      <main className="lg:col-span-8 space-y-6">
        <div className="bg-slate-800/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {isSimulating && (
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                   <span className="font-black text-white uppercase tracking-widest text-sm">Optimizing Scenario...</span>
                </div>
             </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            <div>
              <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                 Recommended Service Price
                 {showComparison && <span className="bg-purple-500 text-white text-[8px] px-2 py-0.5 rounded-full uppercase">Compare Mode</span>}
              </h3>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-white tracking-tighter">
                  ฿{Math.round(current.finalPrice).toLocaleString()}
                </span>
                {showComparison && (
                   <span className="text-2xl font-bold text-slate-500 line-through">
                      ฿{Math.round(comparison.finalPrice).toLocaleString()}
                   </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
               <div className={`flex items-center gap-2 ${aiTheme.badgeBg} px-4 py-2 rounded-xl border ${aiTheme.badgeBorder} transition-colors duration-500`}>
                  <Award className={`w-4 h-4 ${aiTheme.icon} transition-colors duration-500`} />
                  <span className={`text-sm font-black ${aiTheme.header} uppercase transition-colors duration-500`}>Expertise Multiplier Applied</span>
               </div>
               <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">AI Efficiency Rating</div>
                  <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => (
                        <div key={s} className={`h-1.5 w-6 rounded-full ${s <= (current.efficiencyScore / 20) ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Direct Labor', value: current.labor, icon: Users, color: 'text-blue-400', benchmark: '+4% vs Region' },
              { label: 'Net Margin', value: current.margin, icon: TrendingUp, color: 'text-emerald-400', benchmark: 'Top 10% KPI' },
              { label: 'Risk Premium', value: current.riskPremium, icon: AlertTriangle, color: 'text-orange-400', benchmark: 'Standard' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-2 rounded-xl bg-slate-900 ${item.color}`}>
                     <item.icon className="w-5 h-5" />
                   </div>
                   <span className="text-[9px] font-black text-slate-500 bg-black/30 px-2 py-1 rounded uppercase">{item.benchmark}</span>
                </div>
                <p className="text-slate-400 text-xs font-bold mb-1 uppercase">{item.label}</p>
                <p className="text-2xl font-black text-white">฿{Math.round(item.value).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col md:flex-row gap-4">
            <button 
              onClick={handleSimulate}
              className="flex-1 bg-gradient-to-r from-purple-600 to-[#632380] hover:from-purple-500 hover:to-[#7c2d12] text-white py-6 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-xl shadow-purple-500/10 flex items-center justify-center gap-3"
            >
              GENERATE QUOTATION
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setExportDropdown({...exportDropdown, engine: !exportDropdown.engine})}
                onBlur={() => setTimeout(() => setExportDropdown({...exportDropdown, engine: false}), 200)}
                className="w-full md:w-auto px-8 py-6 bg-slate-700 hover:bg-slate-600 rounded-2xl transition-all text-white font-bold flex items-center justify-center gap-3 h-full"
              >
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">EXPORT</span>
              </button>
              
              {exportDropdown.engine && (
                <div className="absolute bottom-full right-0 mb-4 w-60 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                  <button className="w-full text-left px-5 py-4 hover:bg-slate-700 flex items-center gap-4 text-sm text-white font-bold transition-colors">
                    <FileText className="w-6 h-6 text-red-400" /> 
                    <div>
                      <div className="leading-tight">PDF Report</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">Standard quotation</div>
                    </div>
                  </button>
                  <div className="h-[1px] bg-slate-700"></div>
                  <button className="w-full text-left px-5 py-4 hover:bg-slate-700 flex items-center gap-4 text-sm text-white font-bold transition-colors">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="leading-tight">Excel Data</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">Raw financial breakdown</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // --- Render Distribution ---
  const renderDistribution = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <PieChart className="w-7 h-7 text-[#F58220]" />
                Dynamic Distribution
              </h2>
              <p className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-widest">Calculated with Incentive Multipliers</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Share Pool</div>
              <div className="text-3xl font-black text-[#F58220]">฿{Math.round(current.finalPrice).toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-400">ALLOCATION STREAM</span>
                  <div className="flex gap-4">
                     {current.efficiencyScore > 70 && (
                       <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded">
                          <Zap className="w-3 h-3" /> Performance Bonus Active
                       </div>
                     )}
                  </div>
               </div>
               <div className="flex h-16 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 ring-1 ring-white/5">
                 <div className="bg-[#632380] hover:brightness-125 transition-all flex flex-col items-center justify-center" style={{ width: '50%' }}>
                    <span className="text-[10px] font-black text-white/50 uppercase">Team</span>
                    <span className="text-sm font-black text-white">50%</span>
                 </div>
                 <div className="bg-[#F58220] hover:brightness-125 transition-all flex flex-col items-center justify-center" style={{ width: '20%' }}>
                    <span className="text-[10px] font-black text-white/50 uppercase">Reserve</span>
                    <span className="text-sm font-black text-white">20%</span>
                 </div>
                 <div className="bg-slate-600 hover:brightness-125 transition-all flex flex-col items-center justify-center" style={{ width: '15%' }}>
                    <span className="text-[10px] font-black text-white/50 uppercase">OH</span>
                    <span className="text-sm font-black text-white">15%</span>
                 </div>
                 <div className="bg-emerald-600 hover:brightness-125 transition-all flex flex-col items-center justify-center" style={{ width: '15%' }}>
                    <span className="text-[10px] font-black text-white/50 uppercase">Net</span>
                    <span className="text-sm font-black text-white">15%</span>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Field Technical Team', subtitle: current.efficiencyScore > 70 ? 'Base 40% + 10% Performance Bonus' : 'Base 50% Allocation', amount: current.finalPrice * 0.5, color: 'border-purple-500/30' },
                { title: 'Substation Asset Fund', subtitle: 'Depreciation & Future Replacement', amount: current.finalPrice * 0.2, color: 'border-orange-500/30' },
                { title: 'Support & Administration', subtitle: 'Central Overhead & Taxes', amount: current.finalPrice * 0.15, color: 'border-slate-500/30' },
                { title: 'PEA Corporate Margin', subtitle: 'Net Contribution to Organization', amount: current.finalPrice * 0.15, color: 'border-emerald-500/30' },
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-[2rem] bg-white/5 border ${item.color} group hover:bg-white/10 transition-all`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.title}</p>
                  <p className="text-xs text-slate-400 mb-3 font-medium">{item.subtitle}</p>
                  <div className="text-3xl font-black text-white tracking-tight">฿{Math.round(item.amount).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`bg-gradient-to-br ${aiTheme.wrapper} p-8 rounded-[2.5rem] border relative overflow-hidden transition-colors duration-500`}>
             <div className="absolute -right-8 -bottom-8 opacity-10">
                <Award className="w-40 h-40" />
             </div>
             <h3 className={`text-xs font-black ${aiTheme.header} uppercase tracking-[0.2em] mb-4 transition-colors duration-500`}>AI Incentives & Insights</h3>
             <p className="text-slate-300 text-sm leading-relaxed mb-6">
                The <span className="text-white font-bold">Efficiency Score</span> threshold is dynamically adjusted based on the mission priority ({jobType.toUpperCase()}) to ensure strategic resource optimization.
             </p>
             <div className={`${aiTheme.popup} p-4 rounded-2xl border space-y-3 backdrop-blur-md transition-colors duration-500`}>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Applied Logic Model:</div>
                  <div className={`text-xs font-bold flex items-center gap-2 ${aiTheme.header} transition-colors duration-500`}>
                     <Target className={`w-3 h-3 ${aiTheme.icon} transition-colors duration-500`} />
                     {current.aiRule}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Performance Target:</div>
                  <div className={`text-xs font-bold flex items-center gap-2 ${aiTheme.header} transition-colors duration-500`}>
                     <CheckCircle2 className={`w-3 h-3 ${aiTheme.icon} transition-colors duration-500`} />
                     {current.aiTarget}
                  </div>
                </div>
                {current.efficiencyScore > 70 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                     <div className={`text-xs ${aiTheme.header} font-bold flex items-center gap-2 transition-colors duration-500`}>
                        <Award className="w-3 h-3" />
                        Score &gt; 70: +10% Bonus Applied
                     </div>
                  </div>
                )}
             </div>
          </div>
          
          <div className="bg-slate-800/60 p-8 rounded-[2.5rem] border border-slate-700/50">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Market Benchmark</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                   <span className="text-slate-400 font-bold">Average Regional Cost</span>
                   <span className="text-white font-black">฿125,400</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold italic text-center">Your quote is 12% more competitive than regional avg.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Audit Log & Detail View ---
  const renderAuditLog = () => {
    // If a log is selected, show the Detail View
    if (selectedLog) {
      return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
          <div className="bg-slate-800/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative">
            <button 
              onClick={() => setSelectedLog(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <Receipt className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  Transaction Details
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedLog.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${selectedLog.sts === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {selectedLog.sts}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Mission Overview
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Station</span>
                    <span className="text-white font-bold">{selectedLog.st}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Date</span>
                    <span className="text-white font-bold">{selectedLog.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type</span>
                    <span className="text-purple-400 font-bold">{selectedLog.details.type}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700/50">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Resource Utilization
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Staff Deployed</span>
                    <span className="text-white font-bold">{selectedLog.details.staff} Pers.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Time Logged</span>
                    <span className="text-white font-bold">{selectedLog.details.hours} Hrs.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">AI Score</span>
                    <span className="text-emerald-400 font-bold">{selectedLog.details.efficiency}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-700/50 md:col-span-2 lg:col-span-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Financial Summary
                </p>
                <div className="space-y-3 border-b border-slate-800 pb-3 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Direct Labor Cost</span>
                    <span className="text-white font-bold">฿{selectedLog.details.laborCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Overhead & Depreciation</span>
                    <span className="text-white font-bold">฿{selectedLog.details.ohCost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-slate-300 font-black">Total Billed</span>
                  <span className="text-[#F58220] font-black">฿{selectedLog.val.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setExportDropdown({...exportDropdown, audit: !exportDropdown.audit})}
                  onBlur={() => setTimeout(() => setExportDropdown({...exportDropdown, audit: false}), 200)}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> EXPORT LOG
                </button>

                {exportDropdown.audit && (
                  <div className="absolute bottom-full right-0 mb-4 w-full sm:w-64 bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
                    <button className="w-full text-left px-5 py-4 hover:bg-slate-700 flex items-center gap-3 text-sm text-white font-bold transition-colors">
                      <FileText className="w-5 h-5 text-red-400" /> 
                      <div>
                        <div className="leading-none">PDF Audit Trail</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-1">Official signed document</div>
                      </div>
                    </button>
                    <div className="h-[1px] bg-slate-700"></div>
                    <button className="w-full text-left px-5 py-4 hover:bg-slate-700 flex items-center gap-3 text-sm text-white font-bold transition-colors">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="leading-none">Excel Ledger</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-1">Export for accounting</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default List View
    return (
      <div className="animate-in slide-in-from-right-8 duration-500 space-y-6">
        <div className="bg-slate-800/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <History className="w-7 h-7 text-purple-400" />
                PEAse Transaction Ledger
              </h2>
              <p className="text-slate-500 text-sm mt-1">Immutable audit trail for internal distribution compliance</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search Ledger..." className="bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:ring-2 ring-purple-500" />
              </div>
              <button className="bg-slate-700 p-3 rounded-xl border border-slate-600 text-white"><Filter className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {auditLogsData.map(log => (
              <div 
                key={log.id} 
                onClick={() => setSelectedLog(log)}
                className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group shadow-sm hover:shadow-purple-500/10"
              >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-black text-purple-400 text-xs shadow-inner">
                      {log.id.split('-')[1]}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white">{log.st} <span className="text-slate-500 text-[10px] ml-2 tracking-widest">{log.id}</span></h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{log.date}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${log.sts === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>{log.sts}</span>
                        </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block">
                      <div className="text-lg font-black text-white">฿{log.val.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase group-hover:text-purple-400 transition-colors">View details</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-4 md:p-10">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-[#632380] to-[#9333ea] rounded-[1.5rem] shadow-2xl shadow-purple-500/20 border border-white/10 group cursor-pointer overflow-hidden relative">
               <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
               <Zap className="w-8 h-8 text-white fill-white/20 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                   PEAse <span className="text-[#F58220]">PRO</span>
                 </h1>
                 <span className="bg-white/5 border border-white/10 text-[9px] font-black px-2 py-1 rounded text-slate-500 tracking-[0.2em] uppercase">Optimizer v2</span>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-1 opacity-70">Next-Gen Utility Resource Engine</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800/40 backdrop-blur-2xl p-1.5 rounded-[1.5rem] border border-white/5 shadow-inner">
            {[
              { id: 'calc', label: 'Engine', icon: Calculator },
              { id: 'analytics', label: 'Distribution', icon: BarChart3 },
              { id: 'report', label: 'Audit', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'report') setSelectedLog(null); // Reset detail view when leaving tab
                }}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-widest relative group ${
                  activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#632380] to-[#7c2d12] text-white shadow-2xl shadow-purple-500/20' 
                  : 'text-slate-500 hover:text-white'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === 'calc' && renderPricingEngine()}
        {activeTab === 'analytics' && renderDistribution()}
        {activeTab === 'report' && renderAuditLog()}

        {/* Global Footer Status */}
        <footer className="mt-20 border-t border-slate-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-10 opacity-60 hover:opacity-100 transition-opacity">
           <div className="flex gap-16">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Enterprise Compliance</p>
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-slate-400">ISO-27001 Certified</span>
                 </div>
              </div>
              <div className="space-y-1 border-l border-slate-800 pl-16">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network Load</p>
                 <div className="flex items-center gap-2 text-emerald-500">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-sm font-bold">Stable Ops (12ms)</span>
                 </div>
              </div>
           </div>
           <div className="text-right flex items-center gap-6">
              <div>
                 <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Authenticated Terminal</p>
                 <p className="text-[10px] font-mono text-slate-400 tracking-tighter">PEA_PRO_TERMINAL_BKK_0092</p>
              </div>
              <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center">
                 <Zap className="w-6 h-6 text-purple-600 fill-purple-600/20" />
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default PEAsePro;