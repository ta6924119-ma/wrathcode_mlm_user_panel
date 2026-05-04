import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaFileInvoiceDollar, FaDownload, FaFilter } from 'react-icons/fa';
import AuthService from '../../Apis/AuthService/AuthService';

import "./TaxReport.css";
const TaxReport = ({ user }) => {
    const [financialYear, setFinancialYear] = useState('2024-25');
    const [dateRange, setDateRange] = useState('year');
    const [taxReportData, setTaxReportData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTaxReport = async () => {
            setLoading(true);
            try {
                const response = await AuthService.getTaxReport();
                if (response.success) {
                    setTaxReportData(response.data?.taxReports || response.data || []);
                } else {
                    console.error("Failed to fetch tax report:", response.error);
                }
            } catch (error) {
                console.error("Error fetching tax report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaxReport();
    }, []);

    const safeAmount = (amount) => Number(amount) || 0;

    const totalGross = taxReportData.reduce((sum, r) => sum + safeAmount(r.grossAmount), 0);
    const totalDeductions = taxReportData.reduce((sum, r) => sum + safeAmount(r.deduction), 0);
    const totalTaxable = taxReportData.reduce((sum, r) => sum + safeAmount(r.taxableAmount), 0);
    const totalTax = taxReportData.reduce((sum, r) => sum + safeAmount(r.taxAmount), 0);
    const totalTDS = taxReportData.reduce((sum, r) => sum + safeAmount(r.tdsDeducted), 0);
    const totalNet = taxReportData.reduce((sum, r) => sum + safeAmount(r.netAmount), 0);

    return (
        <BasePage
            title="Tax Report"
            subtitle="View tax summary and TDS deducted on your MLM income"
            icon={<FaFileInvoiceDollar />}
        >
            <div className="tax-report-content">
                <div className="report-header">
                    <div className="filter-section">
                        <FaFilter />
                        <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                            <option value="2023-24">FY 2023-24</option>
                            <option value="2024-25">FY 2024-25</option>
                            <option value="2025-26">FY 2025-26</option>
                        </select>
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                            <option value="quarter">Quarter</option>
                            <option value="year">Full Year</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                    <button className="export-btn">
                        <FaDownload /> Export for ITR
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading tax report...</div>
                ) : (
                    <>
                        <div className="tax-stats">
                            <div className="stat-card">
                                <div className="stat-label">Gross Income</div>
                                <div className="stat-value">${totalGross.toFixed(2)}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Total Deductions</div>
                                <div className="stat-value">${totalDeductions.toFixed(2)}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Taxable Amount</div>
                                <div className="stat-value">${totalTaxable.toFixed(2)}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Tax / TDS Deducted</div>
                                <div className="stat-value">${totalTDS.toFixed(2)}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Net Received</div>
                                <div className="stat-value highlight">${totalNet.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="tax-table-container">
                            <table className="tax-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Income Type</th>
                                        <th>Gross</th>
                                        <th>Deduction</th>
                                        <th>Taxable</th>
                                        <th>Tax Rate</th>
                                        <th>TDS / Tax</th>
                                        <th>Net Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxReportData.length > 0 ? (
                                        taxReportData.map((row, idx) => (
                                            <tr key={row.id || row._id || idx}>
                                                <td data-label="Period">{row.period || '-'}</td>
                                                <td data-label="Income Type">{row.incomeType || '-'}</td>
                                                <td className="amount" data-label="Gross">${safeAmount(row.grossAmount).toFixed(2)}</td>
                                                <td className="deduction" data-label="Deduction">${safeAmount(row.deduction).toFixed(2)}</td>
                                                <td className="amount" data-label="Taxable">${safeAmount(row.taxableAmount).toFixed(2)}</td>
                                                <td data-label="Tax Rate">{row.taxRate || '-'}</td>
                                                <td className="tax-amount" data-label="TDS / Tax">${safeAmount(row.tdsDeducted || row.taxAmount).toFixed(2)}</td>
                                                <td className="net-amount" data-label="Net Amount">${safeAmount(row.netAmount).toFixed(2)}</td>
                                                <td data-label="Status">
                                                    <span className={`status-badge ${(row.status || 'pending').toLowerCase()}`}>
                                                        {row.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                                                No tax report data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <div className="tax-disclaimer">
                    <p>This is a summary for reference. For official tax filing, use the exported report and consult a tax advisor. TDS is deducted as per applicable rates on commission income.</p>
                </div>
            </div>
        </BasePage>
    );
};

export default TaxReport;
