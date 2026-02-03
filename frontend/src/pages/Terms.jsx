import React from 'react';
import { Card } from '../components/Card';

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: February 4, 2026</p>
      </div>

      <Card title="1. Agreement to Terms">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          By accessing and using Job Aggregator, you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by the above, please do not use this service.
        </p>
      </Card>

      <Card title="2. Use License">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
          Permission is granted to temporarily download one copy of the materials (information or software) on 
          Job Aggregator for personal, non-commercial transitory viewing only. This is the grant of a license, 
          not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose or for any public display</li>
          <li>Attempt to decompile or reverse engineer any software contained on the platform</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
      </Card>

      <Card title="3. Disclaimer">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The materials on Job Aggregator are provided on an 'as is' basis. Job Aggregator makes no warranties, 
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </Card>

      <Card title="4. Limitations">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          In no event shall Job Aggregator or its suppliers be liable for any damages (including, without limitation, 
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
          the materials on the platform.
        </p>
      </Card>

      <Card title="5. Accuracy of Materials">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          The materials appearing on Job Aggregator could include technical, typographical, or photographic errors. 
          Job Aggregator does not warrant that any of the materials on the platform are accurate, complete, or current. 
          Job Aggregator may make changes to the materials contained on its platform at any time without notice.
        </p>
      </Card>

      <Card title="6. Links">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Job Aggregator has not reviewed all of the sites linked to its website and is not responsible for the contents 
          of any such linked site. The inclusion of any link does not imply endorsement by Job Aggregator of the site. 
          Use of any such linked website is at the user's own risk.
        </p>
      </Card>

      <Card title="7. Modifications">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Job Aggregator may revise these terms of service for its website at any time without notice. By using this website, 
          you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </Card>

      <Card title="8. Contact">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          If you have any questions about these Terms of Service, please contact us at:{' '}
          <a href="mailto:legal@jobag.com" className="text-blue-600 dark:text-blue-400 hover:underline">
            legal@jobag.com
          </a>
        </p>
      </Card>
    </div>
  );
}
