import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductBenefit {
  name: string;
}

interface ProductIngredient {
  name: string;
}

interface ProductDetailsAccordianProps {
  description?: string;
  longDescription?: string;
  benefits?: ProductBenefit[];
  ingredients?: ProductIngredient[];
}

const ProductDetailsAccordian= ({
  description,
  longDescription,
  benefits = [],
  ingredients = [],
}) => {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            DESCRIPTION
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {description && (
                <div className="prose prose-sm max-w-none">
                  <p>{description}</p>
                </div>
              )}
              {longDescription && (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: longDescription }}
                />
              )}
              {!description && !longDescription && (
                <p>No description available for this product.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            Product Usage
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {benefits.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {benefits.map((benefit, index) => (
                    <li key={index}>{benefit.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No additional details available for this product.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            Product Location
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ingredients.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No additional information available for this product.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="uppercase subHeading tracking-[1px]">
            FAQ&apos;S
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            voluptates, necessitatibus itaque iste perspiciatis odit repudiandae
            dicta aspernatur beatae, quas modi ut illum nulla ea eligendi
            mollitia, impedit fugiat. Consequuntur.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDetailsAccordian;
