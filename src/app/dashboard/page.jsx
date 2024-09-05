import React from 'react';

const DashboardPage = () => {
  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>
      <nav className="bg-gray-700 p-4 text-center">
        <ul className="flex justify-between">
          <li className="mr-4">
            <a href="#" className="text-white hover:text-gray-300">Overview</a>
          </li>
          <li className="mr-4">
            <a href="#" className="text-white hover:text-gray-300">Analytics</a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-300">Settings</a>
          </li>
        </ul>
      </nav>
      <main className="flex flex-wrap justify-center p-4">
        <section className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-bold">Name</h2>
            <p className="text-1xl font-bold text-black-500">Ayush Bisht
            <ul>
  <li>Yagyansh</li>
  <li>Dev Shaykya</li>
  <li>Akshita</li>
  <li>Shagun</li>
  <li>Suryansh</li>
</ul>
            </p>
          </div>
        </section>
        <section className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-bold">User Id</h2>
            <p className="text-1xl font-bold text-blue-500">            <ul>
  <li>101</li>
  <li>102</li>
  <li>103</li>
  <li>104</li>
  <li>105</li>
  <li>106</li>
</ul></p>
          </div>
        </section>
        <section className="w-full md:w-1/2 xl:w-1/3 p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-bold">Leaves</h2>
            <p className="text-1xl font-bold text-yellow-500">
            <li>22</li>
  <li>23</li>
  <li>16</li>
  <li>13</li>
  <li>25</li>
  <li>98</li>
            </p>
          </div>
        </section>
        <section className="w-full p-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-2xl font-bold">Contact And Role</h2>
            <div className="flex justify-center">
              <div className="w-full h-64 bg-gray-200 rounded p-4">
              <li>dev@adslabs.xyz--------------Admin</li>
  <li>
 ayush@adslabs.xyz-----------Employee
</li>
  <li> yaggy@adslabs.xyz-----------Employee </li>
  <li>suryansh@adslabs.xyz--------Employee</li>
  <li> shagun@adslabs.xyz----------Employee</li>

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
