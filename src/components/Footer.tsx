export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-20 px-6 md:px-12 py-12 border-gray-200 border-t">
      <div className="flex md:flex-row flex-col justify-between mx-auto max-w-7xl">
        <div className="mb-8 md:mb-0">
          <h3 className="mb-4 font-bold text-gray-900 text-2xl tracking-tight">
            TechEvent<span className="text-blue-600">.</span>
          </h3>
          <p className="max-w-xs text-gray-500">The premier platform for discovering tech events, hackathons, and developer meetups in Türkiye.</p>
        </div>
        <div className="flex space-x-16">
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Platform</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Browse Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Host an Event
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li>
                <a href="#" className="hover:text-blue-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 pt-8 border-gray-200 border-t max-w-7xl text-gray-400 text-sm text-center">© 2026 TechEvent. All rights reserved.</div>
    </footer>
  );
}
