import { ThemeSwitch } from '@layout/ThemeSwitch';
import { Link } from 'react-router';

import { Logo } from '@components/page/shared/Logo';

export function Footer() {
  return (
    <div className="bg-surface-container-low sticky top-full left-0 mt-10 pt-8 pb-6">
      <div className="container">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex w-full flex-col">
            <Logo />
            <div className="mb-2"></div>
            <ThemeSwitch />
            <div className="mt-3 text-sm">
              <div className="text-on-surface-variant">Nike World Headquarters</div>
              <div className="text-on-surface-variant">One Bowerman Drive</div>
              <div className="text-on-surface-variant">Beaverton, Oregon</div>
              <div className="text-on-surface-variant">97005</div>
              <div className="text-on-surface-variant">United States of America</div>
            </div>
            <div className="mt-8 flex gap-10">
              <div>
                <div className="text-on-surface-variant mb-1 text-sm">Phone number</div>
                <a
                  href="tel:+18002011019"
                  className="text-sm"
                >
                  1-800-201-1019
                </a>
              </div>
              <div>
                <div className="text-on-surface-variant mb-1 text-sm">Email</div>
                <a
                  href="mailto:support@skipmatrix.com"
                  className="text-sm"
                >
                  support@nike.com
                </a>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-wrap justify-between gap-10 md:justify-around">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Products</div>
              <Link
                to="/products"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                All products
              </Link>
              <Link
                to="/products?MainCategoryId=11"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Men&apos;s products
              </Link>
              <Link
                to="/products?MainCategoryId=12"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Women&apos;s products
              </Link>
              <Link
                to="/products?MainCategoryId=13"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Kid&apos;s products
              </Link>
              <Link
                to="/products?MainCategoryId=28"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                New products
              </Link>
              <Link
                to="/products?MainCategoryId=27"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Sport products
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Help</div>
              <Link
                to="/page/get-help"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Get Help
              </Link>
              <Link
                to="/page/order-status"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Order Status
              </Link>
              <Link
                to="/page/delivery"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Delivery
              </Link>
              <Link
                to="/page/returns"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Returns
              </Link>
              <Link
                to="/page/payment-options"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Payment Options
              </Link>
              <Link
                to="/page/contact-us"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Contact Us
              </Link>
              <Link
                to="/page/reviews"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Reviews
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Company</div>
              <Link
                to="/page/investors"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Investors
              </Link>
              <Link
                to="/page/sustainability"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Sustainability
              </Link>
              <Link
                to="/page/purpose"
                className="text-on-surface-variant hover:text-on-surface text-sm"
              >
                Purpose
              </Link>
            </div>
          </div>
        </div>
        <div className="mb-14"></div>
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-on-surface-variant text-sm font-medium">© 2025 Nike, Inc. All rights reserved</div>
          <Link
            to="/page/terms-of-use"
            className="text-on-surface-variant hover:text-on-surface text-sm font-semibold"
          >
            Terms of Use
          </Link>
          <Link
            to="/page/terms-of-sale"
            className="text-on-surface-variant hover:text-on-surface text-sm font-semibold"
          >
            Terms of Sale
          </Link>
          <Link
            to="/page/company-details"
            className="text-on-surface-variant hover:text-on-surface text-sm font-semibold"
          >
            Company Details
          </Link>
          <Link
            to="/page/privacy-cookie-policy"
            className="text-on-surface-variant hover:text-on-surface text-sm font-semibold"
          >
            Privacy & Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
