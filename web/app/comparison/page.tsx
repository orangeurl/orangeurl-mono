'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

export default function ComparisonPage() {
  return (
    <div className="space-y-16 py-12">
      <motion.section 
        className="text-center space-y-6"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          OrangeURL vs <span className="gradient-text-primary">Competitors</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See how OrangeURL compares to other URL shortening services
        </p>
      </motion.section>

      <motion.div 
        className="max-w-6xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-bold min-w-[200px]">Feature</th>
                  <th className="text-center p-4 font-bold text-primary min-w-[150px]">
                    OrangeURL<br/>
                    <span className="text-sm font-normal">Free</span>
                  </th>
                  <th className="text-center p-4 font-bold text-primary min-w-[150px]">
                    OrangeURL<br/>
                    <span className="text-sm font-normal">Pro ($5/mo)</span>
                  </th>
                  <th className="text-center p-4 font-bold text-primary min-w-[150px]">
                    OrangeURL<br/>
                    <span className="text-sm font-normal">Premium ($15/mo)</span>
                  </th>
                  <th className="text-center p-4 font-bold min-w-[150px]">
                    Competitor<br/>
                    <span className="text-sm font-normal">Free</span>
                  </th>
                  <th className="text-center p-4 font-bold min-w-[150px]">
                    Competitor<br/>
                    <span className="text-sm font-normal">Core ($10/mo)</span>
                  </th>
                  <th className="text-center p-4 font-bold min-w-[150px]">
                    Competitor<br/>
                    <span className="text-sm font-normal">Growth ($29/mo)</span>
                  </th>
                  <th className="text-center p-4 font-bold min-w-[150px]">
                    Competitor<br/>
                    <span className="text-sm font-normal">Premium ($199/mo)</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Monthly Price</td>
                  <td className="p-4 text-center font-semibold text-primary">$0</td>
                  <td className="p-4 text-center font-semibold text-primary">$5</td>
                  <td className="p-4 text-center font-semibold text-primary">$15</td>
                  <td className="p-4 text-center text-muted-foreground">$0</td>
                  <td className="p-4 text-center text-muted-foreground">$10</td>
                  <td className="p-4 text-center text-muted-foreground">$29</td>
                  <td className="p-4 text-center text-muted-foreground">$199</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Links per month</td>
                  <td className="p-4 text-center">5</td>
                  <td className="p-4 text-center">100</td>
                  <td className="p-4 text-center">500</td>
                  <td className="p-4 text-center text-muted-foreground">5</td>
                  <td className="p-4 text-center text-muted-foreground">100</td>
                  <td className="p-4 text-center text-muted-foreground">500</td>
                  <td className="p-4 text-center text-muted-foreground">3,000</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">QR Codes per month</td>
                  <td className="p-4 text-center">2</td>
                  <td className="p-4 text-center">5</td>
                  <td className="p-4 text-center">15</td>
                  <td className="p-4 text-center text-muted-foreground">2</td>
                  <td className="p-4 text-center text-muted-foreground">5</td>
                  <td className="p-4 text-center text-muted-foreground">10</td>
                  <td className="p-4 text-center text-muted-foreground">200</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Custom landing pages</td>
                  <td className="p-4 text-center">2</td>
                  <td className="p-4 text-center">5</td>
                  <td className="p-4 text-center">15</td>
                  <td className="p-4 text-center text-muted-foreground">2</td>
                  <td className="p-4 text-center text-muted-foreground">5</td>
                  <td className="p-4 text-center text-muted-foreground">10</td>
                  <td className="p-4 text-center text-muted-foreground">20</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Click & scan data retention</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center">Unlimited</td>
                  <td className="p-4 text-center text-muted-foreground">Unlimited</td>
                  <td className="p-4 text-center text-muted-foreground">30 days</td>
                  <td className="p-4 text-center text-muted-foreground">4 months</td>
                  <td className="p-4 text-center text-muted-foreground">1 year</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Custom domain</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Branded links</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Advanced QR customizations</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Bulk creation</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">UTM Builder</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">Mobile deep linking</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 text-red-500 mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors bg-primary/5">
                  <td className="p-4 font-bold">Annual Savings vs Competitor</td>
                  <td className="p-4 text-center font-bold text-green-600">$0</td>
                  <td className="p-4 text-center font-bold text-green-600">Save $338/yr</td>
                  <td className="p-4 text-center font-bold text-green-600">Save $72/yr</td>
                  <td className="p-4 text-center font-bold text-green-600">Save $1,188/yr</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                  <td className="p-4 text-center text-muted-foreground">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <motion.div 
        className="text-center space-y-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <p className="text-muted-foreground">
          * Competitor pricing and features based on publicly available information as of October 2024
        </p>
      </motion.div>
    </div>
  );
}

