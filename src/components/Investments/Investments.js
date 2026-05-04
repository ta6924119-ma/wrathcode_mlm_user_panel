import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setInvestments, addInvestment, setSelectedPlan, calculateDailyReturns } from '../../store/slices/investmentSlice';
import { INVESTMENT_PLANS } from '../../store/slices/investmentSlice';
import { calculateCommissions, updateTeamStats } from '../../store/slices/mlmSystemSlice';
import { addCommission } from '../../store/slices/commissionSlice';
import InvestmentPlanCard from './InvestmentPlanCard';
import InvestmentModal from './InvestmentModal';
import InvestmentHistory from './InvestmentHistory';
import InvestmentStats from './InvestmentStats';
import { EarningsLineChart } from '../Charts/EarningsChart';
import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from '../../utils/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../utils/CustomAlertMessage/index';
import './Investments.css';

const Investments = ({ user }) => {
  const dispatch = useAppDispatch();
  const { plans, investments, activeInvestments, totalInvested, totalReturns, pendingReturns, selectedPlan } = useAppSelector((state) => state.investment);
  const { teamStats, performance } = useAppSelector((state) => state.mlmSystem);
  const [showModal, setShowModal] = useState(false);
  const [mlmType, setMlmType] = useState("Binary");

  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalReturns: 0,
    pendingReturns: 0,
    activeCount: 0,
  })


  useEffect(() => {
    fetchInvestmentData();


    // Calculate daily returns periodically
    const interval = setInterval(() => {
      dispatch(calculateDailyReturns());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [dispatch]);


  //string value ko number me convert
  const parseAmount = (val) => Number(String(val).replace(/[^0-9.]/g, '') || 0);

  const parseDays = (val) => Number(String(val).replace(/[^0-9]/g, '') || 0);

  const fetchInvestmentData = async () => {
    try {
      LoaderHelper.loaderStatus(true);

      const result = await AuthService.getInvestmentDashboard();
      console.log(result, "==getinvertmentdashboard");

      if (result?.success) {
        const data = result;

        // const mappedPlans = (data.availablePlans || []).map((p, i) => ({
        //   id: p.plan,
        //   name: p.plan,
        //   min: parseAmount(p.minimum),
        //   max: parseAmount(p.maximum),
        //   maxROI: parseInt(p.roi),
        //   duration: parseDays(p.duration),
        //   color: "#6366f1", // default
        //   icon: "💰"
        // }));
        setSummary({
          totalInvested: parseAmount(data.summary?.totalInvested),
          totalReturns: parseAmount(data.summary?.totalReturns),
          pendingReturns: parseAmount(data.summary?.pendingReturns),
          activeCount: data.activeInvestmentsCount || 0,

        });

        const mappedInvestments = (data.activeInvestments || []).map((inv, i) => ({
          id: i + 1,
          plan: {
            name: inv.plan,
            maxROI: parseInt(inv.roi),
            duration: parseDays(inv.daysElapsed) + parseDays(inv.daysRemaining),
            color: "#6366f1",
            icon: "💰"
          },
          amount: parseAmount(inv.amount),
          status: "active",
          startDate: new Date(),
          endDate: new Date(),
          returns: parseAmount(inv.currentReturns),
        }));

        //  History mapping
        const mappedHistory = (data.investmentHistory || []).map((inv, i) => ({
          id: i + 100,
          plan: { name: inv.plan, icon: "💰" },
          amount: parseAmount(inv.amount),
          returns: parseAmount(inv.returns || inv.currentReturns || 0),
          status: inv.status ? inv.status.toLowerCase() : 'completed',
          endDate: inv.endDate || new Date(),
        }));

        //  Redux update
        dispatch(setInvestments([...mappedInvestments, ...mappedHistory]));

      } else {
        alertErrorMessage(result?.message || 'Failed to fetch investment data');
      }
    } catch (error) {
      alertErrorMessage('Something went wrong while fetching investment data.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };


  const handlePlanSelect = (plan) => {
    dispatch(setSelectedPlan(plan));
    setMlmType("Binary");
    setShowModal(true);
  };

  const mapPlanToBackend = (plan) => {
    const name = plan.name?.toLowerCase();

    if (name.includes("basic")) return "basic";
    if (name.includes("binary")) return "Binary";
    if (name.includes("matrix")) return "Matrix";
    if (name.includes("unilevel")) return "Unilevel";

    return "Binary";
  };
  const handleInvest = async (plan, amount) => {
    if (amount >= plan.min && amount <= plan.max) {
      try {
        LoaderHelper.loaderStatus(true);

        const payload = {
          planId: mapPlanToBackend(plan),
          amount: Number(amount),
          mlmType: mlmType,
        };

        console.log("Sending payload:", payload);

        const result = await AuthService.createInvestment(payload);
        console.log(result, "create investment")

        if (result?.success) {
          dispatch(addInvestment({ plan, amount, mlmType })); // optional store
          alertSuccessMessage(result?.message || 'Investment created successfully!');
          setShowModal(false);
          dispatch(setSelectedPlan(null));
          fetchInvestmentData();
        } else {
          alertErrorMessage(result?.message || result?.error);
        }
      } catch (error) {
        alertErrorMessage('Something went wrong during investment.');
      } finally {
        LoaderHelper.loaderStatus(false);
      }
    } else {
      alertErrorMessage('Please enter a valid investment amount.');
    }
  };
  // const handleInvest = async (plan, amount) => {
  //   if (amount >= plan.min && amount <= plan.max) {
  //     try {
  //       LoaderHelper.loaderStatus(true);

  //       const payload = {
  //         planId: mapPlanToBackend(plan),
  //         amount: Number(amount),
  //       };

  //       console.log("Sending payload:", payload);

  //       const result = await AuthService.createInvestment(payload);

  //       if (result?.success) {
  //         dispatch(addInvestment({ plan, amount }));
  //         alertSuccessMessage(result?.message || 'Investment created successfully!');
  //         setShowModal(false);
  //         dispatch(setSelectedPlan(null));
  //         fetchInvestmentData();
  //       } else {
  //         alertErrorMessage(result?.message || result?.error);
  //       }
  //     } catch (error) {
  //       alertErrorMessage('Something went wrong during investment.');
  //     } finally {
  //       LoaderHelper.loaderStatus(false);
  //     }
  //   } else {
  //     alertErrorMessage('Please enter a valid investment amount.');
  //   }
  // };

  // Prepare chart data for investments
  const investmentChartData = investments
    .filter(inv => inv.status === 'completed')
    .reduce((acc, inv) => {
      const date = new Date(inv.endDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += inv.returns;
      return acc;
    }, {});

  // const chartData = Object.entries(investmentChartData)
  //   .map(([month, returns]) => ({
  //     month,
  //     earnings: returns,
  //   }))
  //   .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="investments-container">
      <div className="page-header">
        <div>
          <h1>Investment Plans</h1>
          <p>Choose from our range of investment plans and start earning today</p>
        </div>
      </div>

      {/* Investment Stats */}
      {/* <InvestmentStats
        totalInvested={summery.totalInvested}
        totalReturns={totalReturns}
        pendingReturns={pendingReturns}
        activeInvestments={activeInvestments.length}
      /> */}

      <InvestmentStats
        totalInvested={summary.totalInvested}
        totalReturns={summary.totalReturns}
        pendingReturns={summary.pendingReturns}
        activeCount={summary.activeCount}
      />



      {/* Investment Plans Section */}
      <div className="plans-section">
        <h2 className="section-title">Available Investment Plans</h2>

        {/* Plans Table View - Desktop */}
        {/* <div className="plans-table-card plans-table-desktop">
          <div className="plans-table">
            <div className="table-header">
              <div className="table-cell">Plan</div>
              <div className="table-cell">Min Investment</div>
              <div className="table-cell">Max Investment</div>
              <div className="table-cell">Max ROI</div>
              <div className="table-cell">Duration</div>
              <div className="table-cell">Action</div>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="table-row plan-table-row">
                <div className="table-cell" data-label="Plan">
                  <div className="plan-cell-table">
                    <span className="plan-icon-table">{plan.icon}</span>
                    <span className="plan-name-table">{plan.name}</span>
                  </div>
                </div>
                <div className="table-cell" data-label="Min Investment">
                  ${plan.min.toLocaleString()}
                </div>
                <div className="table-cell" data-label="Max Investment">
                  ${plan.max.toLocaleString()}
                </div>
                <div className="table-cell" data-label="Max ROI">
                  <span className="roi-badge">{plan.maxROI}%</span>
                </div>
                <div className="table-cell" data-label="Duration">
                  {plan.duration} days
                </div>
                <div className="table-cell" data-label="Action">
                  <button 
                    className="invest-btn-table"
                    style={{ background: plan.color }}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Plans Grid View - Mobile */}
        <div className="plans-grid plans-grid-mobile">
          {plans.map((plan) => (
            <InvestmentPlanCard
              key={plan.id}
              plan={plan}
              onSelect={() => handlePlanSelect(plan)}
            />
          ))}
        </div>
      </div>

      {/* Active Investments */}
      {activeInvestments.length > 0 && (
        <div className="active-investments-section">
          <h2 className="section-title">Active Investments</h2>
          <div className="active-investments-list">
            {activeInvestments.map((investment) => {
              const daysElapsed = Math.floor((new Date() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24));


              const daysRemaining = Math.floor((new Date(investment.endDate) - new Date()) / (1000 * 60 * 60 * 24));

              const expectedReturn = (investment.amount * investment.plan.maxROI) / 100;

              const progress = Math.min((daysElapsed / investment.plan.duration) * 100, 100);

              return (
                <div key={investment.id} className="active-investment-card">
                  <div className="investment-header">
                    <div className="investment-plan-info">
                      <span className="plan-icon">{investment.plan.icon}</span>
                      <div>
                        <h3>{investment.plan.name} Plan</h3>
                        <p className="investment-amount">${investment.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="investment-status active">Active</span>
                  </div>

                  <div className="investment-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                          background: investment.plan.color
                        }}
                      />
                    </div>
                    <div className="progress-info">
                      <span>{daysElapsed} days elapsed</span>
                      <span>{daysRemaining} days remaining</span>
                    </div>
                  </div>

                  <div className="investment-details">
                    <div className="detail-item">
                      <span className="detail-label">Expected Return:</span>
                      <span className="detail-value">${expectedReturn.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Current Returns:</span>
                      <span className="detail-value earnings">${investment.returns.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">ROI:</span>
                      <span className="detail-value">{investment.plan.maxROI}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Investment History */}
      <InvestmentHistory investments={investments} />

      {/* Investment Modal */}
      {/* {showModal && selectedPlan && (
        <InvestmentModal
          plan={selectedPlan}
          onClose={() => {
            setShowModal(false);
            dispatch(setSelectedPlan(null));
          }}
          onInvest={handleInvest}
        />
      )} */}

      {showModal && selectedPlan && (
        <InvestmentModal
          plan={selectedPlan}
          mlmType={mlmType}
          setMlmType={setMlmType}
          onClose={() => {
            setShowModal(false);
            dispatch(setSelectedPlan(null));
          }}
          onInvest={handleInvest}
        />
      )}
    </div>
  );
};

export default Investments;
