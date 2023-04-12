(async () => {
  const API_URL = "https://urlshorterner-alexconlag.b4a.run/urls";

  const form = document.querySelector("form");
  const inputUrlField = document.querySelector("#url");
  const shortenedUrlField = document.querySelector("#shortened-url");
  const copyButton = document.querySelector("#copy-btn");
  const hostUrl = `${window.location.protocol}//${window.location.host}`;

  /**
   * Shortens a URL using the API.
   * @param {string} url - The URL to shorten.
   * @returns {string} - The shortened URL code.
   * @throws {Error} - If the URL cannot be shortened.
   */
  const shortenUrl = async (url) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      return data.code;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to shorten URL");
    }
  };

  /**
   * Displays the shortened URL to the user.
   * @param {string} url - The shortened URL.
   */
  const displayShortenedUrl = (url) => {
    shortenedUrlField.value = url;
    const shortUrlSection = document.querySelector(".shortened-url-container");
    shortUrlSection.style.display = "flex";
  };

  /**
   * Handles form submission.
   * @param {Event} event - The form submission event.
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const url = inputUrlField.value.trim();

    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      const code = await shortenUrl(url);
      const shortenedUrl = `${hostUrl}?c=${code}`;
      displayShortenedUrl(shortenedUrl);
    } catch (error) {
      console.log(error);
      alert("Failed to shorten URL");
    }
  };

  /**
   * Handles click on copy button.
   */
  const handleCopyBtnClick = () => {
    shortenedUrlField.select();
    document.execCommand("copy");
    copyButton.innerText = "Copied!";
  };

  /**
   * Redirects the user to the specified URL.
   * @param {string} code - The code for the URL to redirect to.
   * @throws {Error} - If the URL cannot be redirected to.
   */
  const redirectToUrl = async (code) => {
    try {
      const response = await fetch(`${API_URL}/${code}`);
      const data = await response.json();
      if (data && data.url) {
        window.location = data.url;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to redirect to URL");
    }
  };

  form.addEventListener("submit", handleFormSubmit);
  copyButton.addEventListener("click", handleCopyBtnClick);

  // Redirect the user to the specified website
  const urlParams = new URLSearchParams(window.location.search);
  const redirectCode = urlParams.get("c");

  if (redirectCode) {
    await redirectToUrl(redirectCode);
  }
})();
