/** Static Tokyo Night workbench — visual anchor for the hero. Not interactive. */
export function ProductPreview() {
  return (
    <div className="lf-preview" aria-hidden>
      <div className="lf-preview__chrome">
        <div className="lf-preview__traffic">
          <span />
          <span />
          <span />
        </div>
        <div className="lf-preview__tabs">
          <span className="is-active">two-sum.ts</span>
          <span>predict.md</span>
          <span>tests</span>
        </div>
        <div className="lf-preview__pill">judged</div>
      </div>
      <div className="lf-preview__body">
        <aside className="lf-preview__rail">
          <p className="lf-preview__rail-label">Problem</p>
          <h3>Two Sum</h3>
          <p className="lf-preview__meta">
            <span className="is-easy">Easy</span>
            <span>Array · Hash Table</span>
          </p>
          <p className="lf-preview__blurb">
            Given an array of integers <code>nums</code> and an integer{" "}
            <code>target</code>, return indices of the two numbers that add up to
            target.
          </p>
          <div className="lf-preview__examples">
            <div>
              <span>Input</span>
              <code>nums = [2,7,11,15], target = 9</code>
            </div>
            <div>
              <span>Output</span>
              <code>[0, 1]</code>
            </div>
          </div>
        </aside>
        <div className="lf-preview__editor">
          <pre className="lf-preview__code">
            <code>
              <span className="tok-kw">function</span>{" "}
              <span className="tok-fn">twoSum</span>
              <span className="tok-p">(</span>
              <span className="tok-param">nums</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-type">number</span>
              <span className="tok-p">[],</span>{" "}
              <span className="tok-param">target</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-type">number</span>
              <span className="tok-p">):</span>{" "}
              <span className="tok-type">number</span>
              <span className="tok-p">[] {"{"}</span>
              {"\n"}
              {"  "}
              <span className="tok-kw">const</span> map{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-kw">new</span>{" "}
              <span className="tok-type">Map</span>
              <span className="tok-p">&lt;</span>
              <span className="tok-type">number</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-type">number</span>
              <span className="tok-p">&gt;();</span>
              {"\n"}
              {"  "}
              <span className="tok-kw">for</span>{" "}
              <span className="tok-p">(</span>
              <span className="tok-kw">let</span> i{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-num">0</span>
              <span className="tok-p">;</span> i{" "}
              <span className="tok-p">&lt;</span> nums.length
              <span className="tok-p">;</span> i
              <span className="tok-p">++) {"{"}</span>
              {"\n"}
              {"    "}
              <span className="tok-kw">const</span> need{" "}
              <span className="tok-p">=</span> target{" "}
              <span className="tok-p">-</span> nums
              <span className="tok-p">[</span>i
              <span className="tok-p">];</span>
              {"\n"}
              {"    "}
              <span className="tok-kw">if</span>{" "}
              <span className="tok-p">(</span>map.has
              <span className="tok-p">(</span>need
              <span className="tok-p">))</span>{" "}
              <span className="tok-kw">return</span>{" "}
              <span className="tok-p">[</span>map.get
              <span className="tok-p">(</span>need
              <span className="tok-p">)!,</span> i
              <span className="tok-p">];</span>
              {"\n"}
              {"    "}map.set
              <span className="tok-p">(</span>nums
              <span className="tok-p">[</span>i
              <span className="tok-p">],</span> i
              <span className="tok-p">);</span>
              {"\n"}
              {"  "}
              <span className="tok-p">{"}"}</span>
              {"\n"}
              {"  "}
              <span className="tok-kw">return</span>{" "}
              <span className="tok-p">[];</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
            </code>
          </pre>
          <div className="lf-preview__console">
            <span className="is-pass">●</span>
            <span>Passed 3 / 3 visible tests</span>
            <span className="lf-preview__timing">12 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
