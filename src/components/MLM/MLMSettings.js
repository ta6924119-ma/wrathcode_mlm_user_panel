import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setMLMType, updateSettings, MLM_TYPES } from '../../store/slices/mlmSystemSlice';
import { FaCog, FaSave, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MLMSettings.css';

const MLMSettings = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mlmType, settings } = useAppSelector((state) => state.mlmSystem);
  const { user: authUser } = useAppSelector((state) => state.auth);
  const [localSettings, setLocalSettings] = useState(settings);
  const [localMLMType, setLocalMLMType] = useState(mlmType);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Check if user is admin
  const isAdmin = authUser?.role === 'admin' || authUser?.isAdmin === true || authUser?.email === 'admin@wrathcode.com';

  useEffect(() => {
    if (!isAdmin) {
      // Redirect non-admin users
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleMLMTypeChange = (type) => {
    setLocalMLMType(type);
  };

  const handleSettingChange = (key, value) => {
    setLocalSettings({
      ...localSettings,
      [key]: parseFloat(value) || 0,
    });
  };

  const handleLevelCommissionChange = (index, value) => {
    const newCommissions = [...localSettings.levelCommissions];
    newCommissions[index] = parseFloat(value) || 0;
    setLocalSettings({
      ...localSettings,
      levelCommissions: newCommissions,
    });
  };

  const handleSave = () => {
    dispatch(setMLMType(localMLMType));
    dispatch(updateSettings(localSettings));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mlm-settings">
      <div className="settings-header">
        <div>
          <h1><FaCog /> MLM System Settings <FaShieldAlt style={{ fontSize: '20px', color: '#6366f1', marginLeft: '10px' }} /></h1>
          <p>Configure your MLM system parameters and commission structure (Admin Only)</p>
        </div>
        <button className="save-button" onClick={handleSave}>
          <FaSave /> Save Settings
        </button>
      </div>

      {showSaveSuccess && (
        <div className="save-success-message">
          Settings saved successfully!
        </div>
      )}

      {/* MLM Type Selection */}
      <div className="settings-section">
        <h2>MLM Type</h2>
        <div className="mlm-type-grid">
          {Object.values(MLM_TYPES).map((type) => (
            <div
              key={type}
              className={`mlm-type-card ${localMLMType === type ? 'active' : ''}`}
              onClick={() => handleMLMTypeChange(type)}
            >
              <div className="mlm-type-name">{type.toUpperCase().replace(/_/g, ' ')}</div>
              <div className="mlm-type-description">
                {type === MLM_TYPES.UNILEVEL && 'Unlimited levels, level-based commissions'}
                {type === MLM_TYPES.BINARY && 'Two legs (left/right), pairing bonus system'}
                {type === MLM_TYPES.MATRIX && 'Fixed width and depth matrix structure'}
                {type === MLM_TYPES.FORCED_MATRIX && 'Strict matrix with forced placement'}
                {type === MLM_TYPES.STAIR_STEP_BREAKAWAY && 'Breakaway commission after level threshold'}
                {type === MLM_TYPES.CYBERNETIC && 'Cycle-based commission system'}
                {type === MLM_TYPES.GENERATION && 'Generation-based commission structure'}
                {type === MLM_TYPES.AUSTRALIAN_BINARY && 'Binary with ratio-based pairing'}
                {type === MLM_TYPES.LEVEL_ONLY && 'Simple level-based commissions only'}
                {type === MLM_TYPES.HYBRID && 'Combination of multiple MLM types'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <h2>General Settings</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Maximum Levels</label>
            <input
              type="number"
              value={localSettings.maxLevels}
              onChange={(e) => handleSettingChange('maxLevels', e.target.value)}
              min="1"
              max="20"
            />
            <span className="setting-hint">Number of commission levels</span>
          </div>

          <div className="setting-item">
            <label>Minimum Withdrawal</label>
            <input
              type="number"
              value={localSettings.minWithdrawal}
              onChange={(e) => handleSettingChange('minWithdrawal', e.target.value)}
              min="0"
            />
            <span className="setting-hint">Minimum amount for withdrawal</span>
          </div>

          <div className="setting-item">
            <label>Maximum Withdrawal</label>
            <input
              type="number"
              value={localSettings.maxWithdrawal}
              onChange={(e) => handleSettingChange('maxWithdrawal', e.target.value)}
              min="0"
            />
            <span className="setting-hint">Maximum amount per withdrawal</span>
          </div>

          <div className="setting-item">
            <label>Withdrawal Fee (%)</label>
            <input
              type="number"
              value={localSettings.withdrawalFee}
              onChange={(e) => handleSettingChange('withdrawalFee', e.target.value)}
              min="0"
              max="10"
              step="0.1"
            />
            <span className="setting-hint">Percentage fee for withdrawals</span>
          </div>

          <div className="setting-item">
            <label>Global Commission Cap</label>
            <input
              type="number"
              value={localSettings.globalCapping || 50000}
              onChange={(e) => handleSettingChange('globalCapping', e.target.value)}
              min="0"
            />
            <span className="setting-hint">Maximum total commission per period</span>
          </div>
        </div>
      </div>

      {/* Advanced Features Settings */}
      <div className="settings-section">
        <h2>Advanced Features</h2>
        
        {/* Binary Advanced Features */}
        {(localMLMType === MLM_TYPES.BINARY || localMLMType === MLM_TYPES.AUSTRALIAN_BINARY) && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.binaryFlushEnabled || false}
                  onChange={(e) => handleSettingChange('binaryFlushEnabled', e.target.checked)}
                />
                Enable Auto-Flush
              </label>
              <span className="setting-hint">Automatically flush binary legs when threshold reached</span>
            </div>
            {localSettings.binaryFlushEnabled && (
              <div className="setting-item">
                <label>Flush Threshold</label>
                <input
                  type="number"
                  value={localSettings.binaryFlushThreshold || 100}
                  onChange={(e) => handleSettingChange('binaryFlushThreshold', e.target.value)}
                  min="0"
                />
                <span className="setting-hint">Volume difference to trigger flush</span>
              </div>
            )}
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.binaryCompression || false}
                  onChange={(e) => handleSettingChange('binaryCompression', e.target.checked)}
                />
                Enable Compression
              </label>
              <span className="setting-hint">Remove inactive members from calculations</span>
            </div>
          </div>
        )}

        {/* Matrix Advanced Features */}
        {(localMLMType === MLM_TYPES.MATRIX || localMLMType === MLM_TYPES.FORCED_MATRIX) && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.matrixSpillover || false}
                  onChange={(e) => handleSettingChange('matrixSpillover', e.target.checked)}
                />
                Enable Spillover
              </label>
              <span className="setting-hint">Automatically place members in next available position</span>
            </div>
          </div>
        )}

        {/* Advanced Bonuses */}
        <div className="settings-grid">
          <div className="setting-item">
            <label>Fast Start Bonus</label>
            <input
              type="number"
              value={localSettings.fastStartBonus || 50}
              onChange={(e) => handleSettingChange('fastStartBonus', e.target.value)}
              min="0"
            />
            <span className="setting-hint">Bonus amount for new members</span>
          </div>
          <div className="setting-item">
            <label>Fast Start Days</label>
            <input
              type="number"
              value={localSettings.fastStartDays || 30}
              onChange={(e) => handleSettingChange('fastStartDays', e.target.value)}
              min="1"
            />
            <span className="setting-hint">Days to qualify for fast start bonus</span>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={localSettings.infinityBonusEnabled || false}
                onChange={(e) => handleSettingChange('infinityBonusEnabled', e.target.checked)}
              />
              Enable Infinity Bonus
            </label>
            <span className="setting-hint">Unlimited depth commission bonus</span>
          </div>
          {localSettings.infinityBonusEnabled && (
            <div className="setting-item">
              <label>Infinity Bonus (%)</label>
              <input
                type="number"
                value={localSettings.infinityBonusPercent || 1}
                onChange={(e) => handleSettingChange('infinityBonusPercent', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
              <span className="setting-hint">Commission percentage for infinity bonus</span>
            </div>
          )}
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={localSettings.powerBonusEnabled || false}
                onChange={(e) => handleSettingChange('powerBonusEnabled', e.target.checked)}
              />
              Enable Power Bonus
            </label>
            <span className="setting-hint">Bonus for high volume performers</span>
          </div>
          {localSettings.powerBonusEnabled && (
            <>
              <div className="setting-item">
                <label>Power Bonus Threshold</label>
                <input
                  type="number"
                  value={localSettings.powerBonusThreshold || 10000}
                  onChange={(e) => handleSettingChange('powerBonusThreshold', e.target.value)}
                  min="0"
                />
                <span className="setting-hint">Volume threshold for power bonus</span>
              </div>
              <div className="setting-item">
                <label>Power Bonus (%)</label>
                <input
                  type="number"
                  value={localSettings.powerBonusPercent || 2}
                  onChange={(e) => handleSettingChange('powerBonusPercent', e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="setting-hint">Power bonus percentage</span>
              </div>
            </>
          )}
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={localSettings.teamBonusEnabled || false}
                onChange={(e) => handleSettingChange('teamBonusEnabled', e.target.checked)}
              />
              Enable Team Bonus
            </label>
            <span className="setting-hint">Multi-level team performance bonus</span>
          </div>
          {localSettings.teamBonusEnabled && (
            <div className="setting-item">
              <label>Team Bonus Levels</label>
              <input
                type="number"
                value={localSettings.teamBonusLevels || 3}
                onChange={(e) => handleSettingChange('teamBonusLevels', e.target.value)}
                min="1"
                max="10"
              />
              <span className="setting-hint">Number of levels for team bonus</span>
            </div>
          )}
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={localSettings.overrideBonusEnabled || false}
                onChange={(e) => handleSettingChange('overrideBonusEnabled', e.target.checked)}
              />
              Enable Override Bonus
            </label>
            <span className="setting-hint">Leadership override commission</span>
          </div>
          {localSettings.overrideBonusEnabled && (
            <div className="setting-item">
              <label>Override Bonus (%)</label>
              <input
                type="number"
                value={localSettings.overrideBonusPercent || 1}
                onChange={(e) => handleSettingChange('overrideBonusPercent', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
              <span className="setting-hint">Override bonus percentage</span>
            </div>
          )}
        </div>

        {/* Cycle Settings */}
        {localMLMType === MLM_TYPES.CYBERNETIC && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Cycle Type</label>
              <select
                value={localSettings.cycleType || 'daily'}
                onChange={(e) => handleSettingChange('cycleType', e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
              <span className="setting-hint">Commission cycle frequency</span>
            </div>
          </div>
        )}

        {/* Level Capping */}
        <div className="settings-section">
          <h3>Level Commission Capping</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px', fontSize: '14px' }}>
            Set maximum commission limits for each level to control payout distribution
          </p>
          <div className="level-capping-grid">
            {localSettings.levelCommissions.map((commission, index) => (
              <div key={index} className="level-capping-item">
                <label>Level {index + 1} Cap ($)</label>
                <input
                  type="number"
                  value={localSettings.levelCapping?.[index] || 0}
                  onChange={(e) => {
                    const newCapping = [...(localSettings.levelCapping || Array(localSettings.levelCommissions.length).fill(0))];
                    newCapping[index] = parseFloat(e.target.value) || 0;
                    setLocalSettings({
                      ...localSettings,
                      levelCapping: newCapping,
                    });
                  }}
                  min="0"
                  step="0.01"
                />
                <span className="setting-hint">Max commission for level {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="settings-section">
        <h2>Commission Structure</h2>
        
        {/* Level Commissions */}
        <div className="level-commissions">
          <h3>Level Commissions (%)</h3>
          <div className="level-commissions-grid">
            {localSettings.levelCommissions.map((commission, index) => (
              <div key={index} className="level-commission-item">
                <label>Level {index + 1}</label>
                <input
                  type="number"
                  value={commission}
                  onChange={(e) => handleLevelCommissionChange(index, e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span>%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Binary Settings */}
        {(localMLMType === MLM_TYPES.BINARY || localMLMType === MLM_TYPES.AUSTRALIAN_BINARY) && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Binary Pairing Bonus (%)</label>
              <input
                type="number"
                value={localSettings.binaryPairingBonus}
                onChange={(e) => handleSettingChange('binaryPairingBonus', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
              <span className="setting-hint">Commission on weak leg volume</span>
            </div>
            {localMLMType === MLM_TYPES.AUSTRALIAN_BINARY && (
              <div className="setting-item">
                <label>Binary Ratio</label>
                <input
                  type="number"
                  value={localSettings.australianBinaryRatio}
                  onChange={(e) => handleSettingChange('australianBinaryRatio', e.target.value)}
                  min="1"
                  max="10"
                  step="0.1"
                />
                <span className="setting-hint">Ratio for Australian Binary pairing</span>
              </div>
            )}
          </div>
        )}

        {/* Matrix Settings */}
        {(localMLMType === MLM_TYPES.MATRIX || localMLMType === MLM_TYPES.FORCED_MATRIX) && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Matrix Width</label>
              <input
                type="number"
                value={localMLMType === MLM_TYPES.MATRIX ? localSettings.matrixWidth : localSettings.forcedMatrixWidth}
                onChange={(e) => handleSettingChange(localMLMType === MLM_TYPES.MATRIX ? 'matrixWidth' : 'forcedMatrixWidth', e.target.value)}
                min="2"
                max="10"
              />
              <span className="setting-hint">Number of positions per level</span>
            </div>
            <div className="setting-item">
              <label>Matrix Depth</label>
              <input
                type="number"
                value={localMLMType === MLM_TYPES.MATRIX ? localSettings.matrixDepth : localSettings.forcedMatrixDepth}
                onChange={(e) => handleSettingChange(localMLMType === MLM_TYPES.MATRIX ? 'matrixDepth' : 'forcedMatrixDepth', e.target.value)}
                min="2"
                max="10"
              />
              <span className="setting-hint">Number of levels in matrix</span>
            </div>
          </div>
        )}

        {/* Stair Step Breakaway Settings */}
        {localMLMType === MLM_TYPES.STAIR_STEP_BREAKAWAY && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Breakaway Level</label>
              <input
                type="number"
                value={localSettings.breakawayLevel}
                onChange={(e) => handleSettingChange('breakawayLevel', e.target.value)}
                min="1"
                max="10"
              />
              <span className="setting-hint">Level after which breakaway commission applies</span>
            </div>
            <div className="setting-item">
              <label>Breakaway Commission (%)</label>
              <input
                type="number"
                value={localSettings.breakawayCommission}
                onChange={(e) => handleSettingChange('breakawayCommission', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
              <span className="setting-hint">Commission percentage after breakaway</span>
            </div>
          </div>
        )}

        {/* Cybernetic Settings */}
        {localMLMType === MLM_TYPES.CYBERNETIC && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Cycle Amount</label>
              <input
                type="number"
                value={localSettings.cycleAmount}
                onChange={(e) => handleSettingChange('cycleAmount', e.target.value)}
                min="1"
              />
              <span className="setting-hint">Amount required to complete one cycle</span>
            </div>
            <div className="setting-item">
              <label>Cycle Commission (%)</label>
              <input
                type="number"
                value={localSettings.cycleCommission}
                onChange={(e) => handleSettingChange('cycleCommission', e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
              <span className="setting-hint">Commission per completed cycle</span>
            </div>
          </div>
        )}

        {/* Generation Settings */}
        {localMLMType === MLM_TYPES.GENERATION && (
          <div className="settings-grid">
            <div className="setting-item">
              <label>Generation Levels</label>
              <input
                type="number"
                value={localSettings.generationLevels}
                onChange={(e) => handleSettingChange('generationLevels', e.target.value)}
                min="1"
                max="10"
              />
              <span className="setting-hint">Number of generation levels</span>
            </div>
            <div className="setting-item full-width">
              <label>Generation Commissions (%)</label>
              <div className="generation-commissions">
                {localSettings.generationCommission.map((commission, index) => (
                  <div key={index} className="generation-commission-item">
                    <label>Gen {index + 1}</label>
                    <input
                      type="number"
                      value={commission}
                      onChange={(e) => {
                        const newCommissions = [...localSettings.generationCommission];
                        newCommissions[index] = parseFloat(e.target.value) || 0;
                        setLocalSettings({
                          ...localSettings,
                          generationCommission: newCommissions,
                        });
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span>%</span>
                  </div>
                ))}
              </div>
              <span className="setting-hint">Commission percentage for each generation</span>
            </div>
          </div>
        )}

        {/* Matching Bonus */}
        <div className="settings-grid">
          <div className="setting-item">
            <label>Matching Bonus Levels</label>
            <input
              type="number"
              value={localSettings.matchingBonusLevels}
              onChange={(e) => handleSettingChange('matchingBonusLevels', e.target.value)}
              min="0"
              max="10"
            />
            <span className="setting-hint">Number of levels for matching bonus</span>
          </div>
          <div className="setting-item">
            <label>Matching Bonus (%)</label>
            <input
              type="number"
              value={localSettings.matchingBonusPercent}
              onChange={(e) => handleSettingChange('matchingBonusPercent', e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
            <span className="setting-hint">Percentage for matching bonus</span>
          </div>
          <div className="setting-item">
            <label>Leadership Bonus (%)</label>
            <input
              type="number"
              value={localSettings.leadershipBonusPercent}
              onChange={(e) => handleSettingChange('leadershipBonusPercent', e.target.value)}
              min="0"
              max="100"
              step="0.1"
            />
            <span className="setting-hint">Percentage for leadership bonus</span>
          </div>
        </div>
      </div>

      {/* MLM Type Info */}
      <div className="settings-section">
        <h2>MLM Type Information</h2>
        <div className="mlm-type-info">
          <div className="info-card">
            <h3>Unilevel</h3>
            <p>Unlimited levels with decreasing commission percentages. Each level earns a percentage based on downline investments.</p>
          </div>
          <div className="info-card">
            <h3>Binary</h3>
            <p>Two-leg structure (left/right). Commissions earned on the weaker leg volume. Requires balanced team building.</p>
          </div>
          <div className="info-card">
            <h3>Matrix</h3>
            <p>Fixed width and depth structure. Members placed in specific positions. Limited positions per level.</p>
          </div>
          <div className="info-card">
            <h3>Forced Matrix</h3>
            <p>Strict matrix structure with forced placement. Members automatically placed in next available position.</p>
          </div>
          <div className="info-card">
            <h3>Stair Step Breakaway</h3>
            <p>Breakaway commission structure. After reaching breakaway level, members break away and earn different commission rates.</p>
          </div>
          <div className="info-card">
            <h3>Cybernetic</h3>
            <p>Cycle-based system. Commissions earned when investment reaches cycle amount. Multiple cycles can be completed.</p>
          </div>
          <div className="info-card">
            <h3>Generation</h3>
            <p>Generation-based commissions. Each generation level has specific commission percentage. Limited to set number of generations.</p>
          </div>
          <div className="info-card">
            <h3>Australian Binary</h3>
            <p>Binary system with ratio requirements. Legs must maintain specific ratio to earn commissions. More flexible than standard binary.</p>
          </div>
          <div className="info-card">
            <h3>Level Only</h3>
            <p>Simple level-based commission system. No complex structures, just straightforward level commissions.</p>
          </div>
          <div className="info-card">
            <h3>Hybrid</h3>
            <p>Combination of multiple MLM types. Can combine unilevel, binary, and other commission structures for maximum flexibility.</p>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <FaInfoCircle className="info-icon" />
        <div>
          <h3>Important Notes</h3>
          <ul>
            <li>Changes to commission structure will affect future commissions only</li>
            <li>Existing commissions will not be recalculated</li>
            <li>MLM type changes require system restart</li>
            <li>Always test settings in a demo environment first</li>
            <li>Each MLM type has specific requirements - ensure your team structure matches the selected type</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MLMSettings;
