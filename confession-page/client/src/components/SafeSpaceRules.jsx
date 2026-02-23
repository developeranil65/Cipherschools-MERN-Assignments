/**
 * @fileoverview SafeSpaceRules component.
 * Right-side panel showing community guidelines
 */

import { FaShieldAlt } from "react-icons/fa";
import "./SafeSpaceRules.css";

function SafeSpaceRules() {
    return (
        <div className="rules-panel">
            <h3 className="rules-title">
                <FaShieldAlt className="rules-title-icon" />
                Safe Space Rules
            </h3>
            <ul className="rules-list">
                <li className="rule-item">Be Kind & Supportive</li>
                <li className="rule-item">No Names (Anonymity First)</li>
                <li className="rule-item">No Bullying</li>
                <li className="rule-item">Respect everyone's feelings</li>
                <li className="rule-item">Report harmful content</li>
            </ul>
        </div>
    );
}

export default SafeSpaceRules;
