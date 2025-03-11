import "../css/LeidingPage.css";
import React, { useState, useEffect } from "react";
  
const PeopleRolesCarousel = () => {
    // 1) We'll store the groups (one group per role) in state
    const [groups, setGroups] = useState([]);
    // 2) We'll store the "leftmost index" for each group so we can do circular scrolling
    const [currentIndex, setCurrentIndex] = useState([]);
  
    // Define the desired order of roles from highest priority to lowest.
    // If a person has multiple roles, they will appear in all relevant groups,
    // but the groups themselves will be displayed in this order.
    const roleOrder = [
        "HOOFDLEIDING",
        "PINKELS",
        "SPEELCLUB",
        "RAKWI",
        "TITO",
        "KETI",
        "ASPI",
        "BOUWFONDS"
        // ... add any other roles you have
      ];  
    // Friendly labels for each role name
    // If the API returns "BOUWFONDS", we can display "Bouwfonds"
    const roleLabels = {
      BESTUURSLID: "Bestuurslid",
      HOOFDANIMATOR: "Hoofdanimator",
      ANIMATOR: "Animator",
      BOUWFONDS: "Bouwfonds"
      // Add more if needed...
    };
  
    // We'll always show up to 4 people at once in the carousel
    const maxVisible = 4;
  
    // On component mount, fetch from /personen
    useEffect(() => {
      fetch("http://localhost:3307/personen")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // data might have roles as JSON strings or arrays.
          // Make sure we convert them to arrays if needed:
          const parsedData = data.map((person) => {
            let rolesArray;
            if (Array.isArray(person.roles)) {
              rolesArray = person.roles;
            } else {
              // If roles is a string, parse it as JSON
              try {
                rolesArray = JSON.parse(person.roles);
              } catch (err) {
                // fallback if it's just a string
                rolesArray = [person.roles];
              }
            }
            return {
              ...person,
              roles: rolesArray
            };
          });
  
          // Build a map of role -> array of persons
          // so a person with roles ["BESTUURSLID", "BOUWFONDS"] goes into both groups
          const groupsMap = {};
          parsedData.forEach((person) => {
            person.roles.forEach((role) => {
              if (!groupsMap[role]) {
                groupsMap[role] = [];
              }
              groupsMap[role].push(person);
            });
          });
  
          // Convert map to array: [{ groupName: role, members: [...] }, ...]
          let newGroups = Object.entries(groupsMap).map(([roleName, members]) => ({
            groupName: roleName,
            members
          }));
  
          // Sort the groups by roleOrder
          newGroups.sort((a, b) => {
            const indexA = roleOrder.indexOf(a.groupName);
            const indexB = roleOrder.indexOf(b.groupName);
  
            // If both are in roleOrder, compare their indices
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            // If only one is in the array, that one comes first
            if (indexA !== -1 && indexB === -1) return -1;
            if (indexA === -1 && indexB !== -1) return 1;
  
            // If neither is in roleOrder, sort alphabetically or leave them at the bottom
            return a.groupName.localeCompare(b.groupName);
          });
  
          // For each group, we only need to store a "leftmost index" for the circular slider
          // Initialize all to 0
          const initialIndices = new Array(newGroups.length).fill(0);
  
          setGroups(newGroups);
          setCurrentIndex(initialIndices);
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);
  
    // Helper: get the visible slice of up to 4 members, circularly
    const getVisibleMembers = (members, start, count) => {
      const total = members.length;
      const visible = [];
      for (let i = 0; i < Math.min(count, total); i++) {
        visible.push(members[(start + i) % total]);
      }
      return visible;
    };
  
    // Slide one card to the left
    const handlePrev = (groupIdx, total) => {
      setCurrentIndex((prev) => {
        const newIndices = [...prev];
        newIndices[groupIdx] = (prev[groupIdx] - 1 + total) % total;
        return newIndices;
      });
    };
  
    // Slide one card to the right
    const handleNext = (groupIdx, total) => {
      setCurrentIndex((prev) => {
        const newIndices = [...prev];
        newIndices[groupIdx] = (prev[groupIdx] + 1) % total;
        return newIndices;
      });
    };
  
    return (
      <div className="roles-carousel-container">
        {groups.map((group, gIndex) => {
          const totalMembers = group.members.length;
          // Always show up to 4 visible members
          const visibleMembers = getVisibleMembers(
            group.members,
            currentIndex[gIndex],
            maxVisible
          );
  
          // We only show arrows if there are more than 4 members in that group
          const showArrows = totalMembers > maxVisible;
  
          // If there's a label for this role, use it; otherwise fallback to the roleName
          const roleDisplayName = roleLabels[group.groupName] || group.groupName;
  
          return (
            <div className="group-block" key={gIndex}>
              <h2 className="group-title">{roleDisplayName}</h2>
              <div className="carousel-wrapper">
                {showArrows && (
                  <button
                    className="arrow left-arrow"
                    onClick={() => handlePrev(gIndex, totalMembers)}
                  >
                    &lt;
                  </button>
                )}
  
                <div className="people-row">
                  {visibleMembers.map((person, pIndex) => (
                    <div className="person-card" key={pIndex}>
                      <div className="image-container">
                        <img
                          src={person.imageUrl}
                          alt={person.name}
                          className="person-image"
                        />
                        <div className="person-overlay">
                          <p className="person-description">
                            {person.description}
                          </p>
                        </div>
                      </div>
                      <h3 className="person-name">{person.name}</h3>
                      {/* Show all roles joined by hyphens */}
                      <p className="person-role">
                        {Array.isArray(person.roles)
                          ? person.roles.join("-")
                          : person.roles}
                      </p>
                    </div>
                  ))}
                </div>
  
                {showArrows && (
                  <button
                    className="arrow right-arrow"
                    onClick={() => handleNext(gIndex, totalMembers)}
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  export default PeopleRolesCarousel;
  